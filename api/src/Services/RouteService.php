<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Services;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Response;

/**
 * Route service. Prefers a configured routing provider (Google Routes) and
 * falls back to the demo estimate. Never presents an estimate as a ticket.
 */
final class RouteService
{
    private Config $config;
    private ProviderRegistry $registry;

    public function __construct(Config $config)
    {
        $this->config = $config;
        $this->registry = new ProviderRegistry($config);
    }

    public function route(array $params): array
    {
        $origin = (string) ($params['origin'] ?? '');
        $destination = (string) ($params['destination'] ?? '');
        if ($origin === '' || $destination === '') {
            Response::error(422, 'missing_params', 'Both "origin" and "destination" are required.');
        }
        $mode = (string) ($params['travel_mode'] ?? 'driving');

        foreach ($this->registry->routes() as $p) {
            try {
                return $p->route($params);
            } catch (\Throwable $e) {
                error_log('[ghuraghuri-api] route provider ' . $p->providerName() . ' failed: ' . $e->getMessage());
            }
        }
        Response::error(500, 'route_failed', 'Could not compute a route right now. Please try again in a moment.');
    }
}