<?php

declare(strict_types=1);

namespace Ghuraghuri\Api;

use PDO;

/**
 * Optional MySQL/PDO connection. Returns null when not configured so the API
 * degrades gracefully to file-cache + demo provider on a plain static host.
 */
final class Database
{
    private static ?PDO $pdo = null;

    public static function connect(Config $config): ?PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }
        $host = (string) $config->get('DB_HOST', '127.0.0.1');
        $port = (int) $config->get('DB_PORT', 3306);
        $name = (string) $config->get('DB_NAME', 'ghuraghuri');
        $user = (string) $config->get('DB_USER', 'root');
        $pass = (string) $config->get('DB_PASSWORD', '');
        if ($host === '' || $user === '') {
            return null;
        }
        if (!extension_loaded('pdo_mysql')) {
            return null;
        }
        try {
            self::$pdo = new PDO(
                "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (\PDOException $e) {
            error_log('[ghuraghuri-api] db connect failed: ' . $e->getMessage());
            self::$pdo = null;
        }
        return self::$pdo;
    }
}