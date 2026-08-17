<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Contracts;

/**
 * Provider interface for point-to-point route estimates (distance/duration).
 * This is separate from ticket inventory.
 */
interface RouteProviderInterface
{
    /**
     * @param array $params origin, destination, travel_mode, origin_lat,
     *                     origin_lng, destination_lat, destination_lng
     * @return array{
     *   provider: string,
     *   demo: bool,
     *   estimate: bool,
     *   origin: string,
     *   destination: string,
     *   distance_km: float,
     *   duration_minutes: int,
     *   travel_mode: string,
     *   steps?: array<int, array<string,mixed>>
     * }
     */
    public function route(array $params): array;

    public function isConfigured(): bool;

    public function providerName(): string;
}