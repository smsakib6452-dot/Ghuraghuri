<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Services;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Response;

/**
 * Restaurant service. Same provider-selection strategy as HotelService.
 */
final class RestaurantService
{
    private Config $config;
    private ProviderRegistry $registry;

    public function __construct(Config $config)
    {
        $this->config = $config;
        $this->registry = new ProviderRegistry($config);
    }

    public function search(array $params): array
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $limit = max(1, min(24, (int) ($params['limit'] ?? 10)));
        $params['page'] = $page;
        $params['limit'] = $limit;

        $result = null;
        $errors = [];
        foreach ($this->registry->restaurants() as $p) {
            try {
                $result = $p->search($params);
                break;
            } catch (\Throwable $e) {
                error_log('[ghuraghuri-api] restaurant provider ' . $p->providerName() . ' failed: ' . $e->getMessage());
                $errors[] = $p->providerName();
            }
        }

        if ($result === null) {
            return [
                'page' => 1, 'limit' => $limit, 'total' => 0, 'pages' => 0, 'items' => [],
                'provider' => 'none', 'demo' => false,
                'message' => "We couldn't load live restaurant data right now. Please try again in a moment.",
                'errors' => $errors,
            ];
        }

        $items = $result['items'] ?? [];
        return array_merge(Response::paginate($items, $page, $limit, (int) ($result['total'] ?? count($items))), [
            'provider' => $result['provider'] ?? '',
            'demo' => (bool) ($result['demo'] ?? false),
            'message' => $result['message'] ?? null,
            'filters' => $params,
        ]);
    }

    public function nearby(array $params): array
    {
        $limit = max(1, min(12, (int) ($params['limit'] ?? 6)));
        $params['limit'] = $limit;
        $params['page'] = 1;
        $result = null;
        foreach ($this->registry->restaurants() as $p) {
            try {
                $result = $p->nearby($params);
                break;
            } catch (\Throwable $e) {
                error_log('[ghuraghuri-api] restaurant nearby failed: ' . $e->getMessage());
            }
        }
        if ($result === null) {
            return ['items' => [], 'total' => 0, 'provider' => 'none', 'demo' => false];
        }
        return $result;
    }

    public function details(string $id): array
    {
        foreach ($this->registry->restaurants() as $p) {
            try {
                $item = $p->details($id);
                if ($item !== null) {
                    return $item;
                }
            } catch (\Throwable $e) {
                error_log('[ghuraghuri-api] restaurant details failed: ' . $e->getMessage());
            }
        }
        Response::error(404, 'not_found', 'Restaurant not found.');
    }

    /**
     * Admin upsert of a Ghuraghuri-owned restaurant.
     */
    public function adminUpsert(array $payload): array
    {
        $name = trim((string) ($payload['name'] ?? ''));
        if ($name === '') {
            Response::error(422, 'missing_name', 'Restaurant name is required.');
        }
        $db = \Ghuraghuri\Api\Database::connect($this->config);
        if (!$db) {
            return ['ok' => false, 'note' => 'MySQL is not configured. Enable DB_* in api/.env to store local restaurants.'];
        }
        $slug = (string) ($payload['slug'] ?? '');
        if ($slug === '') {
            $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', strtolower($name)) ?? '');
        }
        $stmt = $db->prepare(
            'INSERT INTO restaurants
                (provider, provider_id, slug, name, name_bn, address, district, division,
                 latitude, longitude, rating, review_count, price_level, featured_image,
                 status, featured, created_at, updated_at)
             VALUES
                (:provider, :provider_id, :slug, :name, :name_bn, :address, :district, :division,
                 :lat, :lng, :rating, :reviews, :price_level, :image, :status, :featured, NOW(), NOW())
             ON DUPLICATE KEY UPDATE
                name = VALUES(name), name_bn = VALUES(name_bn), address = VALUES(address),
                district = VALUES(district), division = VALUES(division),
                latitude = VALUES(latitude), longitude = VALUES(longitude),
                rating = VALUES(rating), review_count = VALUES(review_count),
                price_level = VALUES(price_level), featured_image = VALUES(featured_image),
                status = VALUES(status), featured = VALUES(featured), updated_at = NOW()'
        );
        $stmt->execute([
            'provider' => 'ghuraghuri',
            'provider_id' => $slug,
            'slug' => $slug,
            'name' => $name,
            'name_bn' => (string) ($payload['name_bn'] ?? ''),
            'address' => (string) ($payload['address'] ?? ''),
            'district' => (string) ($payload['district'] ?? ''),
            'division' => (string) ($payload['division'] ?? ''),
            'lat' => (float) ($payload['latitude'] ?? 0),
            'lng' => (float) ($payload['longitude'] ?? 0),
            'rating' => (float) ($payload['rating'] ?? 0),
            'reviews' => (int) ($payload['review_count'] ?? 0),
            'price_level' => (string) ($payload['price_level'] ?? ''),
            'image' => (string) ($payload['image'] ?? ''),
            'status' => (string) ($payload['status'] ?? 'active'),
            'featured' => !empty($payload['featured']) ? 1 : 0,
        ]);
        return ['ok' => true, 'slug' => $slug];
    }
}