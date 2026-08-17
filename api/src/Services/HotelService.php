<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Services;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Response;
use Ghuraghuri\Api\Cache\FileCache;

/**
 * Hotel service. Chooses the first configured provider, falling back to the
 * demo provider. Any provider failure is logged and never surfaced raw.
 */
final class HotelService
{
    private Config $config;
    private ProviderRegistry $registry;
    private FileCache $cache;

    public function __construct(Config $config)
    {
        $this->config = $config;
        $this->registry = new ProviderRegistry($config);
        $this->cache = new FileCache((string) $config->get('CACHE_DIR', GHURAGHURI_API_DIR . '/../cache'));
    }

    public function search(array $params): array
    {
        $page = max(1, (int) ($params['page'] ?? 1));
        $limit = max(1, min(24, (int) ($params['limit'] ?? 10)));
        $params['page'] = $page;
        $params['limit'] = $limit;

        $provider = $this->primary();
        $result = null;
        $errors = [];

        foreach ($provider as $p) {
            try {
                $result = $p->search($params);
                break;
            } catch (\Throwable $e) {
                error_log('[ghuraghuri-api] hotel provider ' . $p->providerName() . ' failed: ' . $e->getMessage());
                $errors[] = $p->providerName();
            }
        }

        if ($result === null) {
            return $this->unavailable($errors);
        }

        $items = $result['items'] ?? [];
        $total = (int) ($result['total'] ?? count($items));
        return array_merge(Response::paginate($items, $page, $limit, $total), [
            'provider' => $result['provider'] ?? '',
            'demo' => (bool) ($result['demo'] ?? false),
            'message' => $result['message'] ?? null,
            'filters' => $params,
        ]);
    }

    public function details(string $id): array
    {
        foreach ($this->primary() as $p) {
            try {
                $item = $p->details($id);
                if ($item !== null) {
                    return $item;
                }
            } catch (\Throwable $e) {
                error_log('[ghuraghuri-api] hotel details failed: ' . $e->getMessage());
            }
        }
        Response::error(404, 'not_found', 'Hotel not found.');
    }

    /** @return \Ghuraghuri\Api\Contracts\HotelProviderInterface[] */
    private function primary(): array
    {
        return $this->registry->hotels();
    }

    /**
     * Admin upsert of a Ghuraghuri-owned hotel. Persists to MySQL when
     * available; otherwise returns a clear "requires database" note so the UI
     * never silently loses data.
     */
    public function adminUpsert(array $payload): array
    {
        $name = trim((string) ($payload['name'] ?? ''));
        if ($name === '') {
            Response::error(422, 'missing_name', 'Hotel name is required.');
        }
        $db = \Ghuraghuri\Api\Database::connect($this->config);
        if (!$db) {
            return ['ok' => false, 'note' => 'MySQL is not configured. Enable DB_* in api/.env to store local hotels.'];
        }
        $slug = (string) ($payload['slug'] ?? '');
        if ($slug === '') {
            $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', strtolower($name)) ?? '');
        }
        $stmt = $db->prepare(
            'INSERT INTO hotels
                (provider, provider_id, slug, name, name_bn, address, district, division,
                 latitude, longitude, rating, review_count, featured_image, status, featured, created_at, updated_at)
             VALUES
                (:provider, :provider_id, :slug, :name, :name_bn, :address, :district, :division,
                 :lat, :lng, :rating, :reviews, :image, :status, :featured, NOW(), NOW())
             ON DUPLICATE KEY UPDATE
                name = VALUES(name), name_bn = VALUES(name_bn), address = VALUES(address),
                district = VALUES(district), division = VALUES(division),
                latitude = VALUES(latitude), longitude = VALUES(longitude),
                rating = VALUES(rating), review_count = VALUES(review_count),
                featured_image = VALUES(featured_image), status = VALUES(status),
                featured = VALUES(featured), updated_at = NOW()'
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
            'image' => (string) ($payload['image'] ?? ''),
            'status' => (string) ($payload['status'] ?? 'active'),
            'featured' => !empty($payload['featured']) ? 1 : 0,
        ]);
        return ['ok' => true, 'slug' => $slug];
    }

    private function unavailable(array $errors): array
    {
        return [
            'page' => 1,
            'limit' => 10,
            'total' => 0,
            'pages' => 0,
            'items' => [],
            'provider' => 'none',
            'demo' => false,
            'message' => "We couldn't load live hotel data right now. Please try again in a moment.",
            'errors' => $errors,
        ];
    }
}