<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Site Asset Controller — uploads to the PUBLIC R2 bucket (`ravok-site-assets`)
 * for use on the public website (homepage statues, team photos, etc.).
 *
 * Distinct from InvestorDocumentController which uses the private bucket
 * (`ravok-investor-docs`) and streams files through the backend. Site assets
 * need to be served directly from R2's public URL so <img src> works without
 * a Railway round-trip.
 *
 * Auth pattern matches investor docs: Cloudflare REST API + R2_API_TOKEN.
 */
class SiteAssetController extends Controller
{
    private function bucket(): string
    {
        return env('R2_PUBLIC_BUCKET', 'ravok-site-assets');
    }

    private function publicUrlBase(): string
    {
        return rtrim((string) env('R2_PUBLIC_URL', ''), '/');
    }

    private function r2Url(string $key): string
    {
        $account = env('R2_ACCOUNT_ID');
        $bucket = $this->bucket();
        return "https://api.cloudflare.com/client/v4/accounts/{$account}/r2/buckets/{$bucket}/objects/{$key}";
    }

    /**
     * POST /api/admin/site/assets — multipart upload.
     * Accepts a single file under "file"; returns the public URL.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10 MB max
            'folder' => 'nullable|string|max:64',
        ]);

        if (! env('R2_API_TOKEN')) {
            return response()->json([
                'message' => 'R2 not configured (R2_API_TOKEN missing).',
            ], 500);
        }

        $publicBase = $this->publicUrlBase();
        if (! $publicBase) {
            return response()->json([
                'message' => 'R2_PUBLIC_URL not configured. Cannot serve uploads publicly.',
            ], 500);
        }

        $file = $request->file('file');
        $folder = $request->input('folder');
        $folderSegment = $folder ? trim((string) $folder, '/') . '/' : '';

        $ext = $file->getClientOriginalExtension() ?: 'bin';
        $safeName = Str::lower(Str::random(12));
        $key = $folderSegment . date('Y/m') . '/' . $safeName . '.' . $ext;

        $contentType = $file->getMimeType() ?: 'application/octet-stream';
        $body = file_get_contents($file->getRealPath());

        $response = Http::withToken(env('R2_API_TOKEN'))
            ->withHeaders(['Content-Type' => $contentType])
            ->withBody($body, $contentType)
            ->put($this->r2Url($key));

        if (! $response->successful()) {
            return response()->json([
                'message' => 'Upload to R2 failed.',
                'status' => $response->status(),
                'body' => $response->body(),
            ], 502);
        }

        $publicUrl = $publicBase . '/' . $key;

        return response()->json([
            'key' => $key,
            'url' => $publicUrl,
            'size' => $file->getSize(),
            'mime' => $contentType,
            'original_name' => $file->getClientOriginalName(),
        ]);
    }

    /**
     * GET /api/admin/site/assets — list objects in the bucket.
     * Lightweight list for the asset library: returns recent uploads.
     */
    public function index(): JsonResponse
    {
        if (! env('R2_API_TOKEN')) {
            return response()->json(['data' => [], 'message' => 'R2 not configured'], 200);
        }

        $account = env('R2_ACCOUNT_ID');
        $bucket = $this->bucket();
        $url = "https://api.cloudflare.com/client/v4/accounts/{$account}/r2/buckets/{$bucket}/objects";

        $response = Http::withToken(env('R2_API_TOKEN'))->get($url, ['per_page' => 100]);

        if (! $response->successful()) {
            return response()->json([
                'data' => [],
                'message' => 'List failed: ' . $response->status(),
            ], 200);
        }

        $publicBase = $this->publicUrlBase();
        $items = collect($response->json('result') ?? [])
            ->map(function ($obj) use ($publicBase) {
                $key = $obj['key'] ?? '';
                return [
                    'key' => $key,
                    'url' => $publicBase ? rtrim($publicBase, '/') . '/' . $key : null,
                    'size' => $obj['size'] ?? null,
                    'uploaded' => $obj['uploaded'] ?? null,
                ];
            })
            ->values();

        return response()->json(['data' => $items]);
    }

    /**
     * DELETE /api/admin/site/assets/{key} — remove an object.
     * Note: routing receives `{key}` as the URL-encoded R2 key (with slashes).
     */
    public function destroy(string $key): JsonResponse
    {
        if (! env('R2_API_TOKEN')) {
            return response()->json(['message' => 'R2 not configured'], 500);
        }

        $key = ltrim($key, '/');
        $response = Http::withToken(env('R2_API_TOKEN'))->delete($this->r2Url($key));

        return response()->json([
            'deleted' => $response->successful(),
            'key' => $key,
        ], $response->successful() ? 200 : 502);
    }
}
