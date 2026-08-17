<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Services;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Response;

/**
 * Transport service. Hands over to the first transport provider that supports
 * the requested transport_type. When no live provider is configured, the demo
 * provider returns clearly-labelled guidance (no invented schedules/prices).
 */
final class TransportService
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
        $type = (string) ($params['transport_type'] ?? '');
        $from = (string) ($params['from'] ?? '');
        $to = (string) ($params['to'] ?? '');
        if ($from === '' || $to === '') {
            Response::error(422, 'missing_params', 'Both "from" and "to" are required.');
        }

        $providers = $this->registry->transports();
        $result = null;
        $errors = [];
        foreach ($providers as $p) {
            if ($type !== '' && !$p->supportsType($type)) {
                continue;
            }
            try {
                $result = $p->search($params);
                break;
            } catch (\Throwable $e) {
                error_log('[ghuraghuri-api] transport provider ' . $p->providerName() . ' failed: ' . $e->getMessage());
                $errors[] = $p->providerName();
            }
        }

        if ($result === null) {
            return [
                'items' => [], 'total' => 0, 'provider' => 'none',
                'demo' => false, 'live' => false,
                'message' => 'Live transport data is currently unavailable.',
                'errors' => $errors,
            ];
        }

        return [
            'provider' => $result['provider'] ?? '',
            'demo' => (bool) ($result['demo'] ?? false),
            'live' => (bool) ($result['live'] ?? false),
            'message' => $result['message'] ?? null,
            'items' => $result['items'] ?? [],
            'total' => (int) ($result['total'] ?? 0),
            'filters' => $params,
        ];
    }
}