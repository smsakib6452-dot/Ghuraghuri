<?php
/**
 * Ghuraghuri - router script for PHP's built-in web server.
 *
 * The built-in server (php -S) does not apply rewrite rules, so /api/* URLs
 * must be forwarded to the API front controller manually. Everything else is
 * served as a plain static file from the project root.
 *
 * Usage:
 *   php -S localhost:8080 serve.php
 */

if (PHP_SAPI !== 'cli-server') {
    http_response_code(403);
    exit('serve.php is only intended for use with the PHP built-in server (php -S).');
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$path = urldecode($path);
if ($path === '' || $path === '/') {
    $path = '/index.html';
}

/* Reject directory traversal and NUL bytes. */
if (str_contains($path, '..') || str_contains($path, "\0")) {
    http_response_code(404);
    exit('Not found');
}

/* Forward API calls to the front controller with a sane SCRIPT_NAME so the
   router can strip the /api base path. */
if (preg_match('#^/api(/.*)?$#', $path)) {
    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    $_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/api/index.php';
    require __DIR__ . '/api/index.php';
    return true;
}

/* Existing static file: hand back to the built-in server. */
$file = __DIR__ . str_replace('/', DIRECTORY_SEPARATOR, $path);
if (is_file($file)) {
    return false;
}

http_response_code(404);
exit('Not found');