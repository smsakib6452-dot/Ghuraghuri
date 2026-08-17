<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Contracts;

/**
 * Provider interface for restaurants/food.
 */
interface RestaurantProviderInterface
{
    /**
     * @param array $params query, destination, district, division, latitude,
     *                     longitude, radius, cuisine, price_level, rating,
     *                     open_now, page, limit
     */
    public function search(array $params): array;

    /** @param array $params latitude, longitude, radius, limit */
    public function nearby(array $params): array;

    public function details(string $id): ?array;

    public function isConfigured(): bool;

    public function providerName(): string;
}