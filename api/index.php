<?php
/**
 * Ghuraghuri API - front controller.
 *
 * Routes:
 *   GET  /api/health
 *   GET  /api/providers/status
 *   GET  /api/locations/autocomplete?q=...
 *   GET  /api/hotels/search?...
 *   GET  /api/hotels/{id}
 *   GET  /api/restaurants/search?...
 *   GET  /api/restaurants/nearby?...
 *   GET  /api/restaurants/{id}
 *   GET  /api/transport/search?...
 *   GET  /api/routes?...
 *   (admin, guarded by ADMIN_API_TOKEN)
 *   POST /api/admin/hotels/upsert
 *   POST /api/admin/restaurants/upsert
 *   POST /api/admin/places/toggle
 *   POST /api/admin/providers/config
 *
 * All responses are JSON. Errors are normalised; technical details are logged
 * server-side and only surfaced when APP_DEBUG=true in development.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

use Ghuraghuri\Api\Config;
use Ghuraghuri\Api\Response;
use Ghuraghuri\Api\RateLimiter;
use Ghuraghuri\Api\Router;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$app = [
    'config' => Config::load(),
    'cache'  => null, // created lazily when a service needs it
    'db'     => null,
];

if ($app['config']->get('RATE_LIMIT_ENABLED', true)) {
    RateLimiter::guard((int) $app['config']->get('RATE_LIMIT_PER_MINUTE', 120));
}

$router = new Router($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI'], $_SERVER['SCRIPT_NAME'] ?? '/api/index.php');

/* ---------------- Public endpoints ---------------- */

$router->get('/health', function () {
    return Response::json([
        'ok' => true,
        'service' => 'ghuraghuri-api',
        'time' => gmdate('c'),
    ]);
});

$router->get('/providers/status', function () use ($app) {
    $registry = new \Ghuraghuri\Api\Services\ProviderRegistry($app['config']);
    return Response::json(['providers' => $registry->status()]);
});

$router->get('/locations/autocomplete', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\LocationService($app['config']);
    return Response::json($service->autocomplete($params));
});

$router->get('/hotels/search', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\HotelService($app['config']);
    return Response::json($service->search($params));
});

$router->get('/hotels/{id}', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\HotelService($app['config']);
    return Response::json($service->details($params['id'] ?? ''));
});

$router->get('/restaurants/search', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\RestaurantService($app['config']);
    return Response::json($service->search($params));
});

$router->get('/restaurants/nearby', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\RestaurantService($app['config']);
    return Response::json($service->nearby($params));
});

$router->get('/restaurants/{id}', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\RestaurantService($app['config']);
    return Response::json($service->details($params['id'] ?? ''));
});

$router->get('/transport/search', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\TransportService($app['config']);
    return Response::json($service->search($params));
});

$router->get('/routes', function ($params) use ($app) {
    $service = new \Ghuraghuri\Api\Services\RouteService($app['config']);
    return Response::json($service->route($params));
});

/* ---------------- Admin endpoints (token-guarded) ---------------- */

function requireAdminToken(Config $config): void
{
    $expected = (string) $config->get('ADMIN_API_TOKEN', '');
    if ($expected === '' || $expected === 'change_me_to_a_long_random_string') {
        Response::error(503, 'admin_api_not_configured', 'Admin API token is not configured.');
        exit;
    }
    $token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if (!hash_equals($expected, $token)) {
        Response::error(401, 'unauthorized', 'Invalid or missing admin token.');
        exit;
    }
}

$router->post('/admin/hotels/upsert', function ($params) use ($app) {
    requireAdminToken($app['config']);
    $service = new \Ghuraghuri\Api\Services\HotelService($app['config']);
    return Response::json($service->adminUpsert($params));
});

$router->post('/admin/restaurants/upsert', function ($params) use ($app) {
    requireAdminToken($app['config']);
    $service = new \Ghuraghuri\Api\Services\RestaurantService($app['config']);
    return Response::json($service->adminUpsert($params));
});

$router->post('/admin/places/toggle', function ($params) use ($app) {
    requireAdminToken($app['config']);
    $service = new \Ghuraghuri\Api\Services\ProviderRegistry($app['config']);
    return Response::json($service->togglePlace($params));
});

$router->post('/admin/providers/config', function ($params) use ($app) {
    requireAdminToken($app['config']);
    $service = new \Ghuraghuri\Api\Services\ProviderRegistry($app['config']);
    return Response::json($service->setConfig($params));
});

/* ---------------- Fallback ---------------- */

$router->fallback(function () {
    Response::error(404, 'not_found', 'Endpoint not found.');
});

$router->run();