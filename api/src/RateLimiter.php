<?php

declare(strict_types=1);

namespace Ghuraghuri\Api;

/**
 * Minimal per-IP rate limiting stored as small files in the cache directory.
 * Silently passes when the cache dir is not writable (fail-open for demo).
 */
final class RateLimiter
{
    public static function guard(int $perMinute): void
    {
        if ($perMinute <= 0) {
            return;
        }
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $dir = GHURAGHURI_API_DIR . '/../cache/ratelimit';
        if (!is_dir($dir) && !@mkdir($dir, 0775, true)) {
            return; // cannot persist -> fail open
        }
        $key = $dir . '/' . md5($ip) . '.json';
        $now = time();
        $window = 60;
        $data = ['count' => 0, 'reset' => $now + $window];
        if (is_file($key)) {
            $raw = @file_get_contents($key);
            $decoded = $raw ? json_decode($raw, true) : null;
            if (is_array($decoded)) {
                $data = $decoded;
            }
        }
        if ($data['reset'] <= $now) {
            $data = ['count' => 0, 'reset' => $now + $window];
        }
        $data['count'] = (int) $data['count'] + 1;
        @file_put_contents($key, json_encode($data));

        if ($data['count'] > $perMinute) {
            Response::error(429, 'rate_limited', 'Too many requests. Please try again shortly.');
        }
    }
}