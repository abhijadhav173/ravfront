<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCorsForApi
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->header('Origin');
        $allowed = $this->getAllowedOrigins();

        if ($origin && $this->isOriginAllowed($origin, $allowed)) {
            $headers = [
                'Access-Control-Allow-Origin' => $origin,
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Accept, Authorization, X-Requested-With',
                'Access-Control-Allow-Credentials' => 'true',
                'Vary' => 'Origin',
                'Access-Control-Max-Age' => '86400',
            ];
        } else {
            $headers = [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Accept, Authorization, X-Requested-With',
                'Vary' => 'Origin',
                'Access-Control-Max-Age' => '86400',
            ];
        }

        if ($request->isMethod('OPTIONS')) {
            return response('', 200)->withHeaders($headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }

    private function getAllowedOrigins(): array
    {
        $fromEnv = array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', '')));
        $defaults = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://testing.ravokstudios.com',
            'https://www.ravokstudios.com',
            'https://ravokstudios.com',
        ];
        return array_merge($fromEnv, $defaults);
    }

    private function isOriginAllowed(string $origin, array $allowed): bool
    {
        if (in_array($origin, $allowed, true)) {
            return true;
        }
        foreach (['#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#'] as $pattern) {
            if (preg_match($pattern, $origin)) {
                return true;
            }
        }
        return false;
    }
}
