<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Site content editor (MVP).
 *
 * One JSON blob per page slug. Public route returns the content for a page;
 * admin route replaces the blob (full upsert) on save.
 *
 * The frontend owns the JSON shape — backend stores arbitrary structures.
 * Validation is deliberately minimal so the editable surface can grow without
 * backend changes during the MVP iteration phase.
 */
class SiteContentController extends Controller
{
    /** GET /api/v1/site/content/{slug} — public, used by the frontend at request time */
    public function show(string $slug): JsonResponse
    {
        $row = SiteContent::where('slug', $slug)->first();

        if (! $row) {
            return response()->json(['slug' => $slug, 'content' => null], 404);
        }

        return response()->json([
            'slug' => $row->slug,
            'content' => $row->content,
            'updated_at' => $row->updated_at,
        ]);
    }

    /** PUT /api/v1/admin/site/content/{slug} — admin only, replaces the JSON */
    public function update(Request $request, string $slug): JsonResponse
    {
        $data = $request->validate([
            'content' => 'required|array',
        ]);

        $row = SiteContent::updateOrCreate(
            ['slug' => $slug],
            ['content' => $data['content']]
        );

        return response()->json([
            'slug' => $row->slug,
            'content' => $row->content,
            'updated_at' => $row->updated_at,
        ]);
    }

    /** GET /api/v1/admin/site/content — admin only, lists all pages */
    public function index(): JsonResponse
    {
        $rows = SiteContent::select(['slug', 'updated_at'])
            ->orderBy('slug')
            ->get();

        return response()->json(['data' => $rows]);
    }
}
