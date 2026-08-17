<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Services;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Response;
use Ghuraghuri\Api\Data\PlacesRepository;

/**
 * Location service: merges the local Bangladesh dataset (places.json) with the
 * Google Places autocomplete when configured. Debouncing is the frontend's job;
 * this endpoint is cheap and cached server-side.
 */
final class LocationService
{
    private Config $config;
    private PlacesRepository $places;

    public function __construct(Config $config)
    {
        $this->config = $config;
        $this->places = new PlacesRepository();
    }

    public function autocomplete(array $params): array
    {
        $q = (string) ($params['q'] ?? '');
        if (trim($q) === '') {
            return ['query' => $q, 'provider' => 'local', 'items' => []];
        }
        $limit = max(1, min(15, (int) ($params['limit'] ?? 10)));

        $items = $this->places->autocomplete($q, $limit);
        $providers = ['local'];

        $registry = new ProviderRegistry($this->config);
        foreach ($registry->locations() as $provider) {
            if ($provider->providerName() !== 'demo' && $provider->isConfigured()) {
                try {
                    $google = $provider->autocomplete(['q' => $q, 'limit' => $limit]);
                    $items = array_merge($items, $google['items'] ?? []);
                    $providers[] = 'google_places';
                } catch (\Throwable $e) {
                    error_log('[ghuraghuri-api] location autocomplete failed: ' . $e->getMessage());
                }
            }
        }

        /* De-duplicate by name+type, keep local first. */
        $seen = [];
        $unique = [];
        foreach ($items as $item) {
            $k = ($item['type'] ?? '') . ':' . ($item['name'] ?? '');
            if (isset($seen[$k])) {
                continue;
            }
            $seen[$k] = true;
            $unique[] = $item;
        }
        $unique = array_slice($unique, 0, $limit);

        return [
            'query' => $q,
            'provider' => $providers,
            'demo' => in_array('local', $providers, true),
            'items' => $unique,
        ];
    }

    /**
     * Resolve a place name to coordinates for reuse by other services.
     */
    public function resolve(string $query): ?array
    {
        return $this->places->resolve($query);
    }
}