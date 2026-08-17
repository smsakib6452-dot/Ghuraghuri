<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Services;

use Ghuraghuri\Api\Config;

/**
 * Factory + status registry for every provider.
 * The registry decides which provider a service talks to, so the frontend
 * never references a specific upstream.
 */
final class ProviderRegistry
{
    private Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function config(): Config
    {
        return $this->config;
    }

    /* ------------------------------------------------------------------ */
    /*  Provider instances                                                 */
    /* ------------------------------------------------------------------ */

    public function hotels(): array
    {
        return [
            new \Ghuraghuri\Api\Providers\GooglePlacesProvider($this->config, 'hotel'),
            new \Ghuraghuri\Api\Providers\BookingProvider($this->config),
            new \Ghuraghuri\Api\Providers\DemoProvider($this->config, 'hotel'),
        ];
    }

    public function restaurants(): array
    {
        return [
            new \Ghuraghuri\Api\Providers\GooglePlacesProvider($this->config, 'restaurant'),
            new \Ghuraghuri\Api\Providers\DemoProvider($this->config, 'restaurant'),
        ];
    }

    public function transports(): array
    {
        return [
            new \Ghuraghuri\Api\Providers\DemoProvider($this->config, 'transport'),
            // Future: BusProvider, TrainProvider, FlightProvider, FerryProvider,
            // CarRentalProvider — each guarded by isConfigured().
        ];
    }

    public function routes(): array
    {
        return [
            new \Ghuraghuri\Api\Providers\GoogleRoutesProvider($this->config),
            new \Ghuraghuri\Api\Providers\DemoProvider($this->config, 'route'),
        ];
    }

    public function locations(): array
    {
        return [
            new \Ghuraghuri\Api\Providers\GooglePlacesProvider($this->config, 'location'),
            new \Ghuraghuri\Api\Providers\DemoProvider($this->config, 'location'),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Status reporting (never leaks secrets)                             */
    /* ------------------------------------------------------------------ */

    public function status(): array
    {
        $list = array_merge($this->hotels(), $this->restaurants(), $this->transports(), $this->routes(), $this->locations());
        $seen = [];
        $out = [];
        foreach ($list as $provider) {
            $name = $provider->providerName();
            if (isset($seen[$name])) {
                continue;
            }
            $seen[$name] = true;
            $out[] = [
                'provider' => $name,
                'configured' => $provider->isConfigured(),
                'status' => $provider->isConfigured() ? 'connected' : 'not_configured',
            ];
        }
        return $out;
    }

    /* ------------------------------------------------------------------ */
    /*  Admin helpers (local inventory / provider toggles)                 */
    /* ------------------------------------------------------------------ */

    public function togglePlace(array $params): array
    {
        // Local-only metadata toggles (feature/hide) are persisted in the DB
        // when MySQL is available. On static hosts this is a no-op success.
        $placeId = (string) ($params['place_id'] ?? '');
        if ($placeId === '') {
            \Ghuraghuri\Api\Response::error(422, 'missing_place_id', 'place_id is required.');
        }
        $featured = isset($params['featured']) ? (bool) $params['featured'] : null;
        $hidden = isset($params['hidden']) ? (bool) $params['hidden'] : null;

        $db = \Ghuraghuri\Api\Database::connect($this->config);
        if ($db) {
            if ($featured !== null) {
                $st = $db->prepare(
                    'UPDATE places SET featured = :f WHERE place_id = :p'
                );
                $st->execute(['f' => $featured ? 1 : 0, 'p' => $placeId]);
            }
            if ($hidden !== null) {
                $st = $db->prepare(
                    'UPDATE places SET status = :s WHERE place_id = :p'
                );
                $st->execute(['s' => $hidden ? 'hidden' : 'active', 'p' => $placeId]);
            }
        }
        return ['ok' => true, 'place_id' => $placeId];
    }

    public function setConfig(array $params): array
    {
        // Only allow toggling provider enable flags that are persisted
        // locally (e.g. enable/disable a provider). Never store secrets here.
        return ['ok' => true, 'note' => 'Provider flags are controlled via api/.env on this deployment.'];
    }
}