<?php

declare(strict_types=1);

namespace Ghuraghuri\Api;

/**
 * Minimal router supporting static paths and {param} segments.
 * Routes are matched in registration order.
 */
final class Router
{
    private string $method;
    private string $path;
    private array $get = [];
    private array $post = [];
    private $fallbackHandler = null;

    public function __construct(string $method, string $uri, string $scriptName = '/api/index.php')
    {
        $this->method = strtoupper($method);
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        /* Strip the script name prefix when running without rewrite rules. */
        if ($scriptName !== '' && $scriptName !== '/') {
            $base = rtrim(dirname($scriptName), '/');
            if ($base !== '/' && str_starts_with($path, $base)) {
                $path = substr($path, strlen($base));
            } elseif ($scriptName !== '/' && str_ends_with($path, $scriptName)) {
                $path = substr($path, 0, -strlen($scriptName));
            }
        }
        if ($path === '' || $path === '/api') {
            $path = '/health';
        }
        $this->path = '/' . trim($path, '/');
    }

    public function get(string $pattern, callable $handler): void
    {
        $this->get[] = [$pattern, $handler];
    }

    public function post(string $pattern, callable $handler): void
    {
        $this->post[] = [$pattern, $handler];
    }

    public function fallback(callable $handler): void
    {
        $this->fallbackHandler = $handler;
    }

    public function run(): void
    {
        $routes = $this->method === 'POST' ? $this->post : $this->get;
        $bodyParams = [];
        if ($this->method === 'POST') {
            $raw = file_get_contents('php://input');
            $decoded = json_decode((string) $raw, true);
            if (is_array($decoded)) {
                $bodyParams = $decoded;
            }
        }
        foreach ($routes as [$pattern, $handler]) {
            $params = $this->match($pattern);
            if ($params === null) {
                continue;
            }
            $merged = array_merge($params, $this->queryParams());
            if ($this->method === 'POST') {
                $merged = array_merge($merged, $bodyParams);
            }
            $handler($merged);
            return;
        }
        if ($this->fallbackHandler) {
            ($this->fallbackHandler)();
            return;
        }
        Response::error(404, 'not_found', 'Endpoint not found.');
    }

    private function queryParams(): array
    {
        return $_GET;
    }

    /** @return array<string,string>|null matched params or null */
    private function match(string $pattern): ?array
    {
        $regex = '#^' . preg_replace('/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/', '(?P<$1>[^/]+)', $pattern) . '$#';
        if (!preg_match($regex, $this->path, $m)) {
            return null;
        }
        $params = [];
        foreach ($m as $k => $v) {
            if (!is_int($k)) {
                $params[$k] = $v;
            }
        }
        return $params;
    }
}