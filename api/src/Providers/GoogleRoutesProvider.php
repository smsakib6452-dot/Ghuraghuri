<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Providers;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Contracts\RouteProviderInterface;
use Ghuraghuri\Api\Http\HttpClient;
use Ghuraghuri\Api\Cache\FileCache;

/**
 * Google Routes API provider (official). Returns real distance/duration and a
 * polyline/step summary. Falls back to the DemoProvider estimate automatically
 * when ROUTES_API_KEY is absent (handled by the RouteService).
 */
final class GoogleRoutesProvider implements RouteProviderInterface
{
    private Config $config;
    private HttpClient $http;
    private FileCache $cache;

    public function __construct(Config $config)
    {
        $this->config = $config;
        $this->http = new HttpClient(20);
        $this->cache = new FileCache((string) $config->get('CACHE_DIR', GHURAGHURI_API_DIR . '/../cache'));
    }

    public function providerName(): string
    {
        return 'google_routes';
    }

    public function isConfigured(): bool
    {
        return $this->config->has('ROUTES_API_KEY');
    }

    public function route(array $params): array
    {
        $key = (string) $this->config->get('ROUTES_API_KEY', '');
        if ($key === '') {
            throw new \RuntimeException('google_routes_not_configured: add ROUTES_API_KEY to api/.env');
        }
        $origin = (string) ($params['origin'] ?? 'Dhaka');
        $destination = (string) ($params['destination'] ?? '');
        $mode = (string) ($params['travel_mode'] ?? 'driving');
        $cacheKey = 'routes:' . md5("{$origin}|{$destination}|{$mode}");

        $cached = $this->cache->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        $payload = [
            'origin' => $this->waypoint($params, $origin, 'origin'),
            'destination' => $this->waypoint($params, $destination, 'destination'),
            'travelMode' => $this->googleMode($mode),
            'routingPreference' => 'TRAFFIC_UNAWARE',
        ];
        $url = 'https://routes.googleapis.com/directions/v2:computeRoutes?fields='
            . 'routes.distanceMeters,routes.duration,routes.legs.steps.navigationInstruction,routes.polyline.encodedPolyline';
        $data = $this->http->postJson(
            $url,
            ['X-Goog-Api-Key: ' . $key, 'X-Goog-FieldMask: routes.distanceMeters,routes.duration,routes.legs.steps.navigationInstruction,routes.polyline.encodedPolyline'],
            $payload
        );

        $route = $data['routes'][0] ?? null;
        if ($route === null) {
            throw new \RuntimeException('no_route_found');
        }
        $durationSec = (float) rtrim((string) ($route['duration'] ?? '0s'), 's');
        $steps = [];
        foreach (($route['legs'][0]['steps'] ?? []) as $i => $step) {
            $steps[] = [
                'instruction' => $step['navigationInstruction']['instructions'] ?? "Step " . ($i + 1),
            ];
        }

        $out = [
            'provider' => 'google_routes',
            'demo' => false,
            'estimate' => false,
            'origin' => $origin,
            'destination' => $destination,
            'distance_km' => round((int) ($route['distanceMeters'] ?? 0) / 1000, 1),
            'duration_minutes' => (int) round($durationSec / 60),
            'travel_mode' => $mode,
            'steps' => $steps,
        ];
        $this->cache->set($cacheKey, $out, (int) $this->config->get('CACHE_TTL_SECONDS', 300));
        return $out;
    }

    private function waypoint(array $params, string $fallback, string $prefix): array
    {
        $lat = $params[$prefix . '_lat'] ?? null;
        $lng = $params[$prefix . '_lng'] ?? null;
        if ($lat !== null && $lng !== null) {
            return ['location' => ['latLng' => ['latitude' => (float) $lat, 'longitude' => (float) $lng]]];
        }
        return ['place' => $fallback];
    }

    private function googleMode(string $mode): string
    {
        return match ($mode) {
            'walking' => 'WALK',
            'cycling' => 'BICYCLE',
            'transit' => 'TRANSIT',
            'flying' => 'DRIVE', // routes API has no flying mode
            default => 'DRIVE',
        };
    }
}