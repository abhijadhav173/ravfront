<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->isAdmin()) {
            $posts = Post::with(['category', 'user'])
                ->orderBy('created_at', 'desc')
                ->paginate(15);
            return response()->json($posts);
        }
        return $this->indexPublic($request);
    }

    private function indexPublic(Request $request): JsonResponse
    {
        $posts = Post::with(['category', 'user'])
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->paginate($request->get('per_page', 15));
        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'featured_image' => ['nullable', 'string', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title']);
        $validated['published_at'] = now();

        $post = Post::create($validated);

        return response()->json($post->load(['category', 'user']), 201);
    }

    public function show(Request $request, Post $post): JsonResponse
    {
        if (! $request->user()->isAdmin()) {
            return $this->showPublic($post);
        }
        $post->load(['category', 'user']);
        return response()->json($post);
    }

    private function showPublic(Post $post): JsonResponse
    {
        if (! $post->published_at || $post->published_at->isFuture()) {
            return response()->json(['message' => 'Not found.'], 404);
        }
        $post->load(['category', 'user']);
        return response()->json($post);
    }

    public function update(Request $request, Post $post): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'body' => ['sometimes', 'string'],
            'featured_image' => ['nullable', 'string', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }
        $post->update($validated);

        return response()->json($post->load(['category', 'user']));
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();
        return response()->json(null, 204);
    }
}
