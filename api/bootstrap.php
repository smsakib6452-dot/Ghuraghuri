<?php
/**
 * Ghuraghuri API - bootstrap / autoloader.
 */

declare(strict_types=1);

define('GHURAGHURI_API_DIR', __DIR__);

/* Simple PSR-4 style autoloader: Ghuraghuri\Api\X\Y -> src/X/Y.php */
spl_autoload_register(function (string $class): void {
    $prefix = 'Ghuraghuri\\Api\\';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $relative = substr($class, strlen($prefix));
    $file = __DIR__ . '/src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Response;

date_default_timezone_set('Asia/Dhaka');

$config = Config::load();

/* Exception handler: never leak internals to the browser. */
set_exception_handler(function (\Throwable $e) use ($config): void {
    $technical = $config->get('APP_DEBUG', false)
        ? ['message' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()]
        : ['message' => 'Internal server error.'];
    error_log('[ghuraghuri-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    Response::error(500, 'internal_error', $technical['message'] ?? 'Internal server error.');
});

set_error_handler(function (int $severity, string $message, string $file, int $line): bool {
    throw new \ErrorException($message, 0, $severity, $file, $line);
});