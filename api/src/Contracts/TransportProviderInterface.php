<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Contracts;

/**
 * Provider interface for transport options between places.
 *
 * Important: providers must return only real, available inventory (or a
 * clearly labelled demo result). When no live API is configured the service
 * returns an explicit "unavailable" response rather than invented schedules.
 */
interface TransportProviderInterface
{
    /**
     * Supported transport types: bus, train, flight, ferry, car, taxi.
     *
     * @param array $params from, to, departure_date, return_date, passengers,
     *                     transport_type, page, limit
     * @return array{
     *   provider: string,
     *   demo: bool,
     *   live: bool,
     *   message?: string,
     *   items: array<int, array<string,mixed>>,
     *   total: int
     * }
     */
    public function search(array $params): array;

    public function supportsType(string $type): bool;

    public function isConfigured(): bool;

    public function providerName(): string;
}