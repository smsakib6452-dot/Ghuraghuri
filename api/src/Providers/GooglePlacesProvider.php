<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Providers;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Contracts\HotelProviderInterface;
use Ghuraghuri\Api\Contracts\RestaurantProviderInterface;
use Ghuraghuri\Api\Contracts\LocationProviderInterface;
use Ghuraghuri\Api\Http\HttpClient;
use Ghuraghuri\Api\Cache\FileCache;

/**
 * Google Places API (New) provider for hotels, restaurants and autocomplete.
 *
 * Uses official endpoints only:
 *   - Text Search  /v1/places:searchText
 *   - Nearby Search /v1/places:searchNearby
 *   - Place Details /v1/places/{placeId}
 *   - Place Photo   /v1/{photoName}/media
 *
 * The API key lives in api/.env and is never sent to the browser. Results are
 * normalised to the shared Ghuraghuri shape.
 */
final class GooglePlacesProvider implements
    HotelProviderInterface,
    RestaurantProviderInterface,
    LocationProviderInterface
{
    private Config $config;
    private string $kind; // hotel | restaurant | location
    private HttpClient $http;
    private FileCache $cache;

    public function __construct(Config $config, string $kind)
    {
        $this->config = $config;
        $this->kind = $kind;
        $this->http = new HttpClient(15);
        $this->cache = new FileCache((string) $config->get('CACHE_DIR', GHURAGHURI_API_DIR . '/../cache'));
    }

    public function providerName(): string
    {
        return 'google_places';
    }

    public function isConfigured(): bool
    {
        return $this->config->has('GOOGLE_MAPS_API_KEY');
    }

    private function key(): string
    {
        return (string) $this->config->get('GOOGLE_MAPS_API_KEY', '');
    }

    private function photoUrl(string $photoName): string
    {
        return "https://places.googleapis.com/v1/{$photoName}/media?key={$this->key()}&maxWidthPx=1200";
    }

    /**
     * Normalise a raw Places result item.
     */
    private function normalise(array $place, string $kind): array
    {
        $display = $place['displayName']['text'] ?? '';
        $location = $place['location'] ?? ['latitude' => 0, 'longitude' => 0];
        $photos = $place['photos'] ?? [];
        $photo = $photos[0]['name'] ?? null;

        $base = [
            'provider' => 'google_places',
            'provider_id' => $place['id'] ?? '',
            'place_id' => $place['id'] ?? '',
            'name' => $display,
            'name_bn' => '',
            'address' => $place['formattedAddress'] ?? '',
            'latitude' => (float) ($location['latitude'] ?? 0),
            'longitude' => (float) ($location['longitude'] ?? 0),
            'rating' => (float) ($place['rating'] ?? 0),
            'review_count' => (int) ($place['userRatingCount'] ?? 0),
            'phone' => $place['nationalPhoneNumber'] ?? ($place['internationalPhoneNumber'] ?? ''),
            'website' => $place['websiteUri'] ?? '',
            'google_maps_url' => $place['googleMapsUri'] ?? '',
            'image' => $photo ? $this->photoUrl($photo) : '',
            'demo' => false,
            'source' => 'google_places',
        ];

        if ($kind === 'hotel') {
            return array_merge($base, [
                'district' => '',
                'division' => '',
                'price' => null,
                'currency' => 'BDT',
                'images' => $this->photoUrls($photos),
                'amenities' => [],
                'booking_url' => $place['googleMapsUri'] ?? '',
                'availability' => 'unknown',
            ]);
        }

        if ($kind === 'restaurant') {
            return array_merge($base, [
                'district' => '',
                'division' => '',
                'price_level' => (string) ($place['priceLevel'] ?? ''),
                'cuisine' => $this->cuisines($place),
                'cover_image' => $photo ? $this->photoUrl($photo) : '',
                'photos' => $this->photoUrls($photos),
                'opening_hours' => '',
                'open_now' => null,
            ]);
        }

        /* location */
        $types = $place['types'] ?? [];
        return array_merge($base, [
            'type' => in_array('locality', $types, true) ? 'locality' : 'place',
            'district' => '',
            'division' => '',
            'lat' => (float) ($location['latitude'] ?? 0),
            'lng' => (float) ($location['longitude'] ?? 0),
        ]);
    }

    private function photoUrls(array $photos): array
    {
        $urls = [];
        foreach (array_slice($photos, 0, 6) as $p) {
            if (isset($p['name'])) {
                $urls[] = $this->photoUrl($p['name']);
            }
        }
        return $urls;
    }

    private function cuisines(array $place): array
    {
        $map = [
            'bakery' => 'Bakery', 'bar' => 'Cafe', 'cafe' => 'Cafe',
            'fast_food' => 'Fast Food', 'restaurant' => 'Restaurant',
            'seafood_restaurant' => 'Seafood', 'indian_restaurant' => 'Indian',
            'chinese_restaurant' => 'Chinese', 'thai_restaurant' => 'Thai',
            'vegetarian_restaurant' => 'Vegetarian',
        ];
        $out = [];
        foreach (($place['types'] ?? []) as $t) {
            if (isset($map[$t])) {
                $out[] = $map[$t];
            }
        }
        return $out ?: ['Restaurant'];
    }

    /* ------------------------------------------------------------------ */
    /*  Dispatch on provider kind                                          */
    /* ------------------------------------------------------------------ */

    public function search(array $params): array
    {
        if ($this->kind === 'hotel') {
            return $this->searchHotels($params);
        }
        return $this->searchRestaurants($params);
    }

    public function details(string $id): ?array
    {
        if ($this->kind === 'hotel') {
            return $this->detailsHotel($id);
        }
        return $this->detailsRestaurant($id);
    }

    /* ------------------------------------------------------------------ */
    /*  Hotels                                                             */
    /* ------------------------------------------------------------------ */

    private function searchHotels(array $params): array
    {
        $this->assertConfigured();
        $textQuery = $this->textQuery($params, 'hotels');
        $limit = min(20, max(1, (int) ($params['limit'] ?? 10)));
        $cacheKey = 'places:hotels:' . md5($textQuery . '|' . $limit);

        $places = $this->cachedTextSearch($cacheKey, $textQuery, $limit, ['hotel', 'lodging', 'resort', 'motel']);
        $items = array_map(fn ($p) => $this->normalise($p, 'hotel'), $places);
        $this->applyFilters($items, $params);

        return [
            'provider' => 'google_places',
            'demo' => false,
            'items' => $items,
            'total' => count($items),
        ];
    }

    private function detailsHotel(string $id): ?array
    {
        $this->assertConfigured();
        $placeId = str_replace('google_places:', '', $id);
        if ($placeId === '') {
            return null;
        }
        $cacheKey = 'places:details:' . md5($placeId);
        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }
        $url = 'https://places.googleapis.com/v1/places/' . rawurlencode($placeId) . '?fields='
            . (string) $this->config->get('GOOGLE_PLACES_FIELDS', '');
        $data = $this->http->getJson($url, ['X-Goog-Api-Key: ' . $this->key()]);
        $item = $this->normalise($data, 'hotel');
        $this->cache->set($cacheKey, $item, (int) $this->config->get('CACHE_TTL_SECONDS', 300));
        return $item;
    }

    /* ------------------------------------------------------------------ */
    /*  Restaurants                                                        */
    /* ------------------------------------------------------------------ */

    private function searchRestaurants(array $params): array
    {
        $this->assertConfigured();
        $textQuery = $this->textQuery($params, 'restaurants');
        $limit = min(20, max(1, (int) ($params['limit'] ?? 10)));
        $cacheKey = 'places:restaurants:' . md5($textQuery . '|' . $limit);

        $places = $this->cachedTextSearch($cacheKey, $textQuery, $limit, ['restaurant', 'food', 'cafe', 'bakery']);
        $items = array_map(fn ($p) => $this->normalise($p, 'restaurant'), $places);
        $this->applyFilters($items, $params);

        return [
            'provider' => 'google_places',
            'demo' => false,
            'items' => $items,
            'total' => count($items),
        ];
    }

    public function nearby(array $params): array
    {
        $this->assertConfigured();
        $lat = (float) ($params['latitude'] ?? 0);
        $lng = (float) ($params['longitude'] ?? 0);
        $radius = min(50000, max(100, (int) ($params['radius'] ?? 5000)));
        $limit = min(20, max(1, (int) ($params['limit'] ?? 10)));
        $cacheKey = 'places:nearby:' . md5("{$lat}|{$lng}|{$radius}|{$limit}");

        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return ['provider' => 'google_places', 'demo' => false, 'items' => $cached, 'total' => count($cached)];
        }

        $payload = [
            'includedTypes' => ['restaurant', 'cafe', 'bakery', 'food'],
            'maxResultCount' => $limit,
            'locationRestriction' => [
                'circle' => [
                    'center' => ['latitude' => $lat, 'longitude' => $lng],
                    'radius' => $radius,
                ],
            ],
        ];
        $url = 'https://places.googleapis.com/v1/places:searchNearby?fields='
            . (string) $this->config->get('GOOGLE_PLACES_FIELDS', '');
        $data = $this->http->postJson($url, ['X-Goog-Api-Key: ' . $this->key()], $payload);
        $places = $data['places'] ?? [];
        $items = array_map(fn ($p) => $this->normalise($p, 'restaurant'), $places);
        $this->applyFilters($items, $params);
        $this->cache->set($cacheKey, $items, (int) $this->config->get('CACHE_TTL_SECONDS', 300));

        return ['provider' => 'google_places', 'demo' => false, 'items' => $items, 'total' => count($items)];
    }

    private function detailsRestaurant(string $id): ?array
    {
        $this->assertConfigured();
        $placeId = str_replace('google_places:', '', $id);
        if ($placeId === '') {
            return null;
        }
        $cacheKey = 'places:rdetails:' . md5($placeId);
        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }
        $url = 'https://places.googleapis.com/v1/places/' . rawurlencode($placeId) . '?fields='
            . (string) $this->config->get('GOOGLE_PLACES_FIELDS', '');
        $data = $this->http->getJson($url, ['X-Goog-Api-Key: ' . $this->key()]);
        $item = $this->normalise($data, 'restaurant');
        $this->cache->set($cacheKey, $item, (int) $this->config->get('CACHE_TTL_SECONDS', 300));
        return $item;
    }

    /* ------------------------------------------------------------------ */
    /*  Location autocomplete                                              */
    /* ------------------------------------------------------------------ */

    public function autocomplete(array $params): array
    {
        $this->assertConfigured();
        $q = (string) ($params['q'] ?? '');
        if ($q === '') {
            return ['provider' => 'google_places', 'demo' => false, 'items' => []];
        }
        $cacheKey = 'places:ac:' . md5($q);
        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return ['provider' => 'google_places', 'demo' => false, 'items' => $cached];
        }
        $payload = [
            'textQuery' => $q,
            'languageCode' => 'bn', // request Bangla where available; fall back to EN
            'regionCode' => 'BD',
        ];
        $url = 'https://places.googleapis.com/v1/places:searchText?fields=places.displayName,places.formattedAddress,places.location,places.types,places.id';
        $data = $this->http->postJson($url, ['X-Goog-Api-Key: ' . $this->key()], $payload);
        $items = array_map(fn ($p) => $this->normalise($p, 'location'), $data['places'] ?? []);
        $this->cache->set($cacheKey, $items, 600);
        return ['provider' => 'google_places', 'demo' => false, 'items' => $items];
    }

    /* ------------------------------------------------------------------ */
    /*  Shared helpers                                                     */
    /* ------------------------------------------------------------------ */

    private function assertConfigured(): void
    {
        if (!$this->isConfigured()) {
            throw new \RuntimeException('google_places_not_configured: add GOOGLE_MAPS_API_KEY to api/.env');
        }
    }

    private function textQuery(array $params, string $kind): string
    {
        $destination = (string) ($params['destination'] ?? $params['district'] ?? '');
        if ($destination !== '') {
            $kindText = $kind === 'hotels' ? 'hotels' : 'restaurants';
            $extra = (string) ($params['query'] ?? '');
            return trim($extra . ' ' . $kindText . ' in ' . $destination) ?: "{$kindText} in {$destination}";
        }
        return (string) ($params['query'] ?? 'restaurants in Bangladesh');
    }

    /**
     * Cached text search over the Places API.
     */
    private function cachedTextSearch(string $cacheKey, string $textQuery, int $limit, array $types): array
    {
        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }
        $payload = [
            'textQuery' => $textQuery,
            'maxResultCount' => $limit,
            'regionCode' => 'BD',
        ];
        if ($types) {
            $payload['includedType'] = $types[0];
        }
        $url = 'https://places.googleapis.com/v1/places:searchText?fields='
            . (string) $this->config->get('GOOGLE_PLACES_FIELDS', '');
        $data = $this->http->postJson($url, ['X-Goog-Api-Key: ' . $this->key()], $payload);
        $places = $data['places'] ?? [];
        $this->cache->set($cacheKey, $places, (int) $this->config->get('CACHE_TTL_SECONDS', 300));
        return $places;
    }

    private function applyFilters(array &$items, array $params): void
    {
        $minRating = isset($params['rating']) && $params['rating'] !== '' ? (float) $params['rating'] : null;
        if ($minRating !== null) {
            $items = array_values(array_filter($items, fn ($i) => (float) ($i['rating'] ?? 0) >= $minRating));
        }
        $cuisine = (string) ($params['cuisine'] ?? '');
        if ($cuisine !== '') {
            $items = array_values(array_filter($items, fn ($i) => in_array($cuisine, $i['cuisine'] ?? [], true)));
        }
    }
}