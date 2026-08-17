<?php

declare(strict_types=1);

namespace Ghuraghuri\Api\Http;

/**
 * Thin cURL wrapper with timeouts, JSON helpers and error normalisation.
 * Every external call flows through here so failures can be caught centrally.
 */
final class HttpClient
{
    private int $timeout;

    public function __construct(int $timeout = 15)
    {
        $this->timeout = $timeout;
    }

    /**
     * Perform a GET request and return decoded JSON on success.
     *
     * @throws \RuntimeException on transport errors / non-2xx
     */
    public function getJson(string $url, array $headers = []): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_USERAGENT => 'Ghuraghuri/1.0 (+https://github.com/)',
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $errno = curl_errno($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($body === false || $errno !== 0) {
            throw new \RuntimeException('upstream_transport_error: ' . ($error ?: 'no response'));
        }
        if ($status < 200 || $status >= 300) {
            $detail = $body !== '' && $body !== false ? substr((string) $body, 0, 500) : '';
            throw new \RuntimeException("upstream_http_{$status}: {$detail}");
        }
        $decoded = json_decode((string) $body, true);
        if (!is_array($decoded)) {
            throw new \RuntimeException('upstream_invalid_json');
        }
        return $decoded;
    }

    /**
     * Perform a JSON POST request and return decoded JSON on success.
     *
     * @throws \RuntimeException on transport errors / non-2xx
     */
    public function postJson(string $url, array $headers, array $payload): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
            CURLOPT_HTTPHEADER => array_merge($headers, ['Content-Type: application/json']),
            CURLOPT_USERAGENT => 'Ghuraghuri/1.0 (+https://github.com/)',
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $errno = curl_errno($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($body === false || $errno !== 0) {
            throw new \RuntimeException('upstream_transport_error: ' . ($error ?: 'no response'));
        }
        if ($status < 200 || $status >= 300) {
            $detail = $body !== '' && $body !== false ? substr((string) $body, 0, 500) : '';
            throw new \RuntimeException("upstream_http_{$status}: {$detail}");
        }
        $decoded = json_decode((string) $body, true);
        if (!is_array($decoded)) {
            throw new \RuntimeException('upstream_invalid_json');
        }
        return $decoded;
    }
}