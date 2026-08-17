<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Providers;

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Contracts\HotelProviderInterface;

/**
 * Booking.com Demand API provider.
 *
 * This is a STRUCTURED STUB: the interface and normalisation are in place, but
 * the provider reports NOT CONFIGURED until BOOKING_API_KEY /
 * BOOKING_AFFILIATE_ID are provided in api/.env. No requests are made without
 * valid partner credentials. When enabled it should map to the Demand API
 * accommodation-search/look/redirect endpoints per partner access.
 */
final class BookingProvider implements HotelProviderInterface
{
    private Config $config;

    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    public function providerName(): string
    {
        return 'booking';
    }

    public function isConfigured(): bool
    {
        return $this->config->has('BOOKING_API_KEY') && $this->config->has('BOOKING_AFFILIATE_ID');
    }

    public function search(array $params): array
    {
        throw new \RuntimeException('booking_not_configured: add BOOKING_API_KEY and BOOKING_AFFILIATE_ID to api/.env');
    }

    public function details(string $id): ?array
    {
        return null;
    }
}