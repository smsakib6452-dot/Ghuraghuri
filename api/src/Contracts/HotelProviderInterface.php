<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Contracts;

/**
 * Provider interface for accommodation (hotels).
 *
 * Every provider returns results normalised to the shared Ghuraghuri shape so
 * the frontend never cares which upstream service produced them.
 */
interface HotelProviderInterface
{
    /**
     * @param array $params destination, district, division, latitude, longitude,
     *                     check_in, check_out, adults, children, rooms,
     *                     min_price, max_price, rating, amenities, hotel_type,
     *                     page, limit
     * @return array{
     *   provider: string,
     *   demo: bool,
     *   message?: string,
     *   items: array<int, array<string,mixed>>,
     *   total: int
     * }
     */
    public function search(array $params): array;

    /**
     * @param string $id provider-prefixed result id, e.g. "demo:hotel-3"
     */
    public function details(string $id): ?array;

    /** Whether this provider is usable with the current configuration. */
    public function isConfigured(): bool;

    public function providerName(): string;
}