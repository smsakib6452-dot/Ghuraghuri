<?php

declare(strict_types=1);

namespace Ghuraghuri\Api;

/**
 * JSON response helpers + normalised error shapes.
 */
final class Response
{
    public static function json(mixed $payload): never
    {
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * @param int    $status  HTTP status code
     * @param string $code    stable machine-readable error code
     * @param string $message human message safe to show to users
     * @param array  $meta    optional extra fields
     */
    public static function error(int $status, string $code, string $message, array $meta = []): never
    {
        http_response_code($status);
        echo json_encode(array_merge([
            'ok' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
            ],
        ], $meta), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function paginate(array $items, int $page, int $limit, int $total): array
    {
        return [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => max(1, (int) ceil($total / max(1, $limit))),
            'items' => $items,
        ];
    }
}