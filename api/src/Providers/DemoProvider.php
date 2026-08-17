<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Providers;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Contracts\HotelProviderInterface;
use Ghuraghuri\Api\Contracts\RestaurantProviderInterface;
use Ghuraghuri\Api\Contracts\TransportProviderInterface;
use Ghuraghuri\Api\Contracts\RouteProviderInterface;
use Ghuraghuri\Api\Contracts\LocationProviderInterface;
use Ghuraghuri\Api\Data\PlacesRepository;

/**
 * DemoProvider — deterministic, clearly-labelled sample data.
 *
 * Used so every feature works before real credentials exist. All results are
 * flagged `demo: true`. No fake live schedules or live prices are emitted;
 * transport items carry typical durations only, with a "live unavailable"
 * message. Real providers must replace this once configured.
 */
final class DemoProvider implements
    HotelProviderInterface,
    RestaurantProviderInterface,
    TransportProviderInterface,
    RouteProviderInterface,
    LocationProviderInterface
{
    private Config $config;
    private string $kind; // hotel | restaurant | transport | route | location
    private PlacesRepository $places;

    private const HOTEL_PHOTOS = [
        'photo-1566073771259-6a8506099945', 'photo-1582719508461-905c673771fd',
        'photo-1520250497591-112f2f40a3f4', 'photo-1521783988139-89397d761dce',
        'photo-1571003123894-1f0594d2b5d9', 'photo-1542314831-068cd1dbfeeb',
        'photo-1611892440504-42a792e24d32', 'photo-1595576508898-0ad5c879a061',
    ];
    private const RESTAURANT_PHOTOS = [
        'photo-1517248135467-4c7edcad34c4', 'photo-1414235077428-338989a2e8c0',
        'photo-1555396273-367ea4eb4db5', 'photo-1466978913421-dad2ebd01d17',
        'photo-1555939594-58d7cb561ad1', 'photo-1504674900247-0877df9cc836',
        'photo-1546069901-ba9599a7e63c', 'photo-1567620905732-2d1ec7ab7445',
    ];
    private const TRANSPORT_PHOTOS = [
        'photo-1544620347-c4fd4a3d5957', 'photo-1474487548417-781cb71495f3',
        'photo-1436491865332-7a61a109cc05', 'photo-1507525428034-b723cf961d3e',
        'photo-1485965120184-e220f721d03e', 'photo-1449965408869-eaa3f722e40d',
    ];

    private const HOTEL_NAMES = [
        'Sea Pearl Resort', 'Hill View Inn', 'Green Garden Hotel',
        'Royal Heritage', 'Lakeview Breeze', 'Grand Palace Lodge',
        'Mangrove Retreat', 'Sundarban Stay', 'Beach Garden Villa',
        'Tea Garden Cottage', 'City Lights Hotel', 'Riverside Inn',
    ];
    private const RESTAURANT_NAMES = [
        'Bhojon Ghar', 'Seafood Bay', 'Tandoor Corner', 'Biryani House',
        'Cha Bagicha Cafe', 'Panta Point', 'Kacchi & Co', 'Meat Bazaar Grill',
        'Green Leaf Kitchen', 'Fish Market Diner', 'Nabanno Table', 'Cox Cafe',
    ];
    private const CUISINES = ['Bangladeshi', 'Chinese', 'Indian', 'Thai', 'Seafood', 'Fast Food', 'Cafe', 'Bakery', 'Dessert', 'Vegetarian'];
    private const AMENITIES = ['Free Wi-Fi', 'AC Rooms', 'Restaurant', 'Parking', 'Room Service', 'Swimming Pool', '24h Front Desk', 'Breakfast Included', 'Airport Shuttle', 'Laundry'];

    public function __construct(Config $config, string $kind)
    {
        $this->config = $config;
        $this->kind = $kind;
        $this->places = new PlacesRepository();
    }

    public function providerName(): string
    {
        return 'demo';
    }

    public function isConfigured(): bool
    {
        return true; // demo data is always available
    }

    /* ------------------------------------------------------------------ */
    /*  Deterministic randomness                                           */
    /* ------------------------------------------------------------------ */

    private function rng(string $seed): callable
    {
        $h = crc32($seed);
        return function () use (&$h): float {
            $h = ($h + 0x6D2B79F5) & 0xFFFFFFFF;
            $t = $h;
            $t = (($t << 15) | ($t >> 17)) & 0xFFFFFFFF;
            $t = ($t * 0x1FFFFFFF + 0x1337) & 0xFFFFFFFF;
            $h = $t;
            return (($h >> 9) ^ $h) / 4294967296;
        };
    }

    private function pick(array $arr, callable $rand): string
    {
        return $arr[floor($rand() * count($arr))];
    }

    private function photo(string $seed): string
    {
        $pool = match ($this->kind) {
            'hotel' => self::HOTEL_PHOTOS,
            'restaurant' => self::RESTAURANT_PHOTOS,
            default => self::TRANSPORT_PHOTOS,
        };
        return 'https://images.unsplash.com/' . $this->pick($pool, $this->rng($seed)) . '?auto=format&fit=crop&w=1200&q=70';
    }

    /* ------------------------------------------------------------------ */
    /*  Location helpers                                                   */
    /* ------------------------------------------------------------------ */

    /**
     * @return array{lat:float,lng:float,name:string,district:string,division:string}
     */
    private function resolveBase(array $params): array
    {
        $lat = isset($params['latitude']) && $params['latitude'] !== '' ? (float) $params['latitude'] : null;
        $lng = isset($params['longitude']) && $params['longitude'] !== '' ? (float) $params['longitude'] : null;
        if ($lat !== null && $lng !== null) {
            $name = (string) ($params['destination'] ?? $params['district'] ?? 'Location');
            return ['lat' => $lat, 'lng' => $lng, 'name' => $name, 'district' => (string) ($params['district'] ?? ''), 'division' => (string) ($params['division'] ?? '')];
        }
        $query = (string) ($params['destination'] ?? $params['district'] ?? $params['query'] ?? $params['from'] ?? '');
        $resolved = $this->places->resolve($query);
        if ($resolved !== null) {
            return [
                'lat' => $resolved['lat'],
                'lng' => $resolved['lng'],
                'name' => $resolved['name'],
                'district' => (string) $resolved['district'],
                'division' => (string) $resolved['division'],
            ];
        }
        return ['lat' => 23.685, 'lng' => 90.3563, 'name' => $query ?: 'Bangladesh', 'district' => '', 'division' => ''];
    }

    /* ------------------------------------------------------------------ */
    /*  Dispatch on provider kind                                          */
    /* ------------------------------------------------------------------ */

    public function search(array $params): array
    {
        return match ($this->kind) {
            'hotel' => $this->searchHotels($params),
            'restaurant' => $this->searchRestaurants($params),
            default => $this->searchTransport($params),
        };
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
        $base = $this->resolveBase($params);
        $limit = min(12, max(1, (int) ($params['limit'] ?? 8)));
        $page = max(1, (int) ($params['page'] ?? 1));
        $offset = ($page - 1) * $limit;
        $ratingMin = (float) ($params['rating'] ?? 0);
        $maxPrice = (float) ($params['max_price'] ?? 0);
        $typeFilter = strtolower((string) ($params['hotel_type'] ?? ''));

        $items = [];
        $pool = 48;
        for ($i = 0; $i < $pool; $i++) {
            $seed = "{$base['name']}|hotel|{$i}";
            $rand = $this->rng($seed);
            $type = $this->pick(['hotel', 'resort', 'guesthouse'], $rand);
            if ($typeFilter !== '' && $type !== $typeFilter) {
                continue;
            }
            $price = (int) (1200 + pow($rand(), 2) * 16000); // skewed toward budget
            if ($maxPrice > 0 && $price > $maxPrice) {
                continue;
            }
            $rating = round(3.5 + $rand() * 1.5, 1);
            if ($ratingMin > 0 && $rating < $ratingMin) {
                continue;
            }
            $name = $this->pick(self::HOTEL_NAMES, $rand) . ' ' . ($i + 1);
            $items[] = [
                'id' => "demo:hotel:{$i}:" . md5($base['name']),
                'provider' => 'demo',
                'provider_id' => "hotel-{$i}",
                'name' => $name,
                'name_bn' => '',
                'hotel_type' => $type,
                'address' => $base['name'] . ' · ' . ($base['district'] ?: 'Bangladesh'),
                'district' => $base['district'],
                'division' => $base['division'],
                'latitude' => round($base['lat'] + ($rand() - 0.5) * 0.02, 5),
                'longitude' => round($base['lng'] + ($rand() - 0.5) * 0.02, 5),
                'rating' => $rating,
                'review_count' => (int) ($rand() * 600 + 12),
                'price' => $price,
                'currency' => 'BDT',
                'image' => $this->photo($seed),
                'images' => [$this->photo($seed . 'a'), $this->photo($seed . 'b'), $this->photo($seed . 'c')],
                'amenities' => $this->sampleAmenities($seed),
                'phone' => '',
                'website' => '',
                'booking_url' => '',
                'availability' => 'demo',
                'source' => 'demo',
                'demo' => true,
            ];
        }
        $paged = array_slice($items, $offset, $limit);
        return [
            'provider' => 'demo',
            'demo' => true,
            'message' => 'Showing sample hotel data (demo). Connect a provider in api/.env for live results.',
            'items' => $paged,
            'total' => count($items),
        ];
    }

    private function sampleAmenities(string $seed): array
    {
        $rand = $this->rng($seed . '|am');
        $n = 4 + floor($rand() * 5);
        $pool = self::AMENITIES;
        $picked = [];
        while (count($picked) < $n && count($pool)) {
            $idx = floor($rand() * count($pool));
            $picked[] = $pool[$idx];
            array_splice($pool, (int) $idx, 1);
        }
        return $picked;
    }

    private function detailsHotel(string $id): ?array
    {
        foreach ($this->searchHotels([])['items'] as $h) {
            if ($h['id'] === $id) {
                return $h;
            }
        }
        return null;
    }

    /* ------------------------------------------------------------------ */
    /*  Restaurants                                                        */
    /* ------------------------------------------------------------------ */

    private function searchRestaurants(array $params): array
    {
        $base = $this->resolveBase($params);
        $limit = min(12, max(1, (int) ($params['limit'] ?? 8)));
        $page = max(1, (int) ($params['page'] ?? 1));
        $offset = ($page - 1) * $limit;
        $cuisineFilter = (string) ($params['cuisine'] ?? '');
        $priceFilter = (string) ($params['price_level'] ?? '');
        $ratingMin = (float) ($params['rating'] ?? 0);
        $openNow = isset($params['open_now']) && $params['open_now'] !== '' && $params['open_now'] !== 'false';

        $items = [];
        $total = 10;
        for ($i = 0; $i < $total; $i++) {
            $seed = "{$base['name']}|restaurant|{$i}";
            $rand = $this->rng($seed);
            $cuisine = $this->pick(self::CUISINES, $rand);
            if ($cuisineFilter !== '' && $cuisine !== $cuisineFilter) {
                continue;
            }
            $priceLevel = (string) (1 + floor($rand() * 3));
            if ($priceFilter !== '' && $priceLevel !== $priceFilter) {
                continue;
            }
            $open = $openNow ? $rand() > 0.2 : true;
            if ($openNow && !$open) {
                continue;
            }
            $rating = round(3.4 + $rand() * 1.5, 1);
            if ($ratingMin > 0 && $rating < $ratingMin) {
                continue;
            }
            $items[] = [
                'id' => "demo:restaurant:{$i}:" . md5($base['name']),
                'provider' => 'demo',
                'provider_id' => "restaurant-{$i}",
                'name' => $this->pick(self::RESTAURANT_NAMES, $rand) . ' ' . ($i + 1),
                'name_bn' => '',
                'address' => $base['name'] . ' · ' . ($base['district'] ?: 'Bangladesh'),
                'district' => $base['district'],
                'division' => $base['division'],
                'latitude' => round($base['lat'] + ($rand() - 0.5) * 0.015, 5),
                'longitude' => round($base['lng'] + ($rand() - 0.5) * 0.015, 5),
                'rating' => $rating,
                'review_count' => (int) ($rand() * 400 + 8),
                'price_level' => $priceLevel,
                'cuisine' => [$cuisine],
                'cover_image' => $this->photo($seed),
                'photos' => [$this->photo($seed . 'a'), $this->photo($seed . 'b')],
                'phone' => '',
                'website' => '',
                'opening_hours' => 'Open daily 9:00–22:00 (demo)',
                'open_now' => $open,
                'google_maps_url' => 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($base['name']),
                'place_id' => '',
                'demo' => true,
            ];
        }
        $paged = array_slice($items, $offset, $limit);
        return [
            'provider' => 'demo',
            'demo' => true,
            'message' => 'Showing sample restaurant data (demo). Connect Google Places in api/.env for live results.',
            'items' => $paged,
            'total' => count($items),
        ];
    }

    public function nearby(array $params): array
    {
        return $this->search($params);
    }

    private function detailsRestaurant(string $id): ?array
    {
        foreach ($this->searchRestaurants([])['items'] as $r) {
            if ($r['id'] === $id) {
                return $r;
            }
        }
        return null;
    }

    /* ------------------------------------------------------------------ */
    /*  Transport                                                          */
    /* ------------------------------------------------------------------ */

    private function searchTransport(array $params): array
    {
        $from = (string) ($params['from'] ?? 'Dhaka');
        $to = (string) ($params['to'] ?? '');
        $type = (string) ($params['transport_type'] ?? '');
        $types = $type !== '' ? [$type] : ['bus', 'train', 'flight'];

        $items = [];
        foreach ($types as $t) {
            if (!$this->supportsType($t)) {
                continue;
            }
            $seed = "{$from}|{$to}|{$t}";
            $rand = $this->rng($seed);
            $typicalMin = match ($t) {
                'flight' => 45 + (int) ($rand() * 40),
                'train' => 240 + (int) ($rand() * 240),
                'ferry' => 360 + (int) ($rand() * 360),
                default => 180 + (int) ($rand() * 300),
            };
            $items[] = [
                'id' => "demo:transport:{$t}:" . md5($from . $to),
                'provider' => 'demo',
                'transport_type' => $t,
                'from' => $from,
                'to' => $to,
                'departure_date' => (string) ($params['departure_date'] ?? ''),
                'typical_duration_minutes' => $typicalMin,
                'price' => null, // no invented pricing
                'currency' => 'BDT',
                'schedule' => [], // no invented schedules
                'carrier' => '',
                'class' => '',
                'booking_url' => '',
                'demo' => true,
                'live' => false,
                'note' => 'Typical duration estimate only (demo). Live schedules unavailable.',
            ];
        }
        return [
            'provider' => 'demo',
            'demo' => true,
            'live' => false,
            'message' => 'Live transport data is currently unavailable. Showing typical travel modes for guidance.',
            'items' => $items,
            'total' => count($items),
        ];
    }

    public function supportsType(string $type): bool
    {
        return in_array($type, ['bus', 'train', 'flight', 'ferry', 'car', 'taxi'], true);
    }

    /* ------------------------------------------------------------------ */
    /*  Routes (estimates)                                                 */
    /* ------------------------------------------------------------------ */

    public function route(array $params): array
    {
        $origin = (string) ($params['origin'] ?? 'Dhaka');
        $destination = (string) ($params['destination'] ?? '');
        $mode = (string) ($params['travel_mode'] ?? 'driving');

        $o = $this->places->resolve($origin);
        $d = $this->places->resolve($destination);
        if ($o === null || $d === null) {
            throw new \RuntimeException('Could not resolve origin or destination.');
        }
        $km = PlacesRepository::distanceKm($o['lat'], $o['lng'], $d['lat'], $d['lng']);
        $roadFactor = 1.3; // typical road multiplier vs straight-line
        $roadKm = round($km * $roadFactor, 1);
        $speedKmh = match ($mode) {
            'flying' => 600,
            'walking' => 5,
            'cycling' => 15,
            'transit' => 45,
            default => 55, // driving
        };
        $minutes = (int) round($roadKm / $speedKmh * 60);
        if ($mode === 'flying') {
            $minutes = (int) max(45, round($km / $speedKmh * 60));
        }

        return [
            'provider' => 'demo',
            'demo' => true,
            'estimate' => true,
            'origin' => $o['name'],
            'destination' => $d['name'],
            'distance_km' => $roadKm,
            'duration_minutes' => $minutes,
            'travel_mode' => $mode,
            'note' => 'Route estimate only (demo). Not ticket availability.',
            'steps' => [
                ['instruction' => "Depart {$o['name']}", 'distance_km' => 0],
                ['instruction' => "Travel toward {$d['name']} (~{$roadKm} km)", 'distance_km' => $roadKm],
                ['instruction' => "Arrive at {$d['name']}", 'distance_km' => 0],
            ],
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Location autocomplete                                              */
    /* ------------------------------------------------------------------ */

    public function autocomplete(array $params): array
    {
        $q = (string) ($params['q'] ?? '');
        $items = $this->places->autocomplete($q, max(1, min(15, (int) ($params['limit'] ?? 10))));
        return ['provider' => 'demo', 'demo' => true, 'items' => $items];
    }
}