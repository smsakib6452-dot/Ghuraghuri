<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Contracts;

/**
 * Provider interface for location autocomplete (English + Bangla aware).
 */
interface LocationProviderInterface
{
    /**
     * @param array $params q, lat, lng, limit
     * @return array{provider: string, items: array<int, array<string,mixed>>}
     */
    public function autocomplete(array $params): array;

    public function isConfigured(): bool;

    public function providerName(): string;
}