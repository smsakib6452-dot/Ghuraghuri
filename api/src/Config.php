<?php

declare(strict_types=1);

namespace Ghuraghuri\Api;

/**
 * Reads environment from api/.env into an in-memory store.
 * Keys are read only from the environment; never echoed to the client.
 */
final class Config
{
    /** @var array<string,string|bool|int|null> */
    private array $values = [];

    private function __construct(array $values)
    {
        $this->values = $values;
    }

    public static function load(): self
    {
        $env = getenv();
        $file = GHURAGHURI_API_DIR . '/.env';
        if (is_file($file)) {
            foreach (self::parse($file) as $k => $v) {
                if (!array_key_exists($k, $env)) {
                    $env[$k] = $v;
                }
            }
        }
        $normalised = [];
        foreach ($env as $k => $v) {
            $normalised[$k] = self::normalise($v);
        }
        return new self($normalised);
    }

    /** @return array<string,string> */
    private static function parse(string $file): array
    {
        $out = [];
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return $out;
        }
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            /* Strip surrounding quotes. */
            if (strlen($value) >= 2 && $value[0] === '"' && $value[strlen($value) - 1] === '"') {
                $value = substr($value, 1, -1);
            }
            $out[$key] = $value;
        }
        return $out;
    }

    private static function normalise(string|bool|int|null $value): string|bool|int|null
    {
        if ($value === null) {
            return null;
        }
        $low = strtolower((string) $value);
        if ($low === 'true') {
            return true;
        }
        if ($low === 'false') {
            return false;
        }
        return $value;
    }

    public function get(string $key, string|bool|int|null $default = null): string|bool|int|null
    {
        return $this->values[$key] ?? $default;
    }

    public function has(string $key): bool
    {
        $v = $this->values[$key] ?? null;
        return $v !== null && $v !== '' && $v !== false;
    }
}