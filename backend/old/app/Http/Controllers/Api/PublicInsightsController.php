<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\PostComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PublicInsightsController extends Controller
{
    /** Published posts only (no auth). */
    private function publishedPostsQuery()
    {
        return Post::with(['category'])
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /** All categories with count of published posts (no auth). */
    public function categories(): JsonResponse
    {
        $categories = Category::withCount([
            'posts' => fn ($q) => $q->whereNotNull('published_at')->where('published_at', '<=', now()),
        ])
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /** Featured published posts (no auth). */
    public function featured(Request $request): JsonResponse
    {
        $limit = min((int) $request->get('limit', 5), 20);
        $posts = $this->publishedPostsQuery()
            ->where('is_featured', true)
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();

        return response()->json($posts);
    }

    /** Published posts, optional category, paginated (no auth). */
    public function posts(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 15), 50);
        $categoryId = $request->get('category_id');
        $query = $this->publishedPostsQuery()->orderByDesc('published_at');

        if ($categoryId !== null && $categoryId !== '') {
            $query->where('category_id', (int) $categoryId);
        }

        $paginated = $query->paginate($perPage);
        return response()->json($paginated);
    }

    /** Published post by slug (no auth). */
    public function showBySlug(string $slug): JsonResponse
    {
        $post = $this->publishedPostsQuery()
            ->where('slug', $slug)
            ->with(['category'])
            ->first();

        if (! $post) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        return response()->json($post);
    }

    /** Approved comments for a published post by slug (no auth). */
    public function comments(string $slug): JsonResponse
    {
        $post = $this->publishedPostsQuery()->where('slug', $slug)->first();
        if (! $post) {
            return response()->json(['message' => 'Not found.'], 404);
        }
        $comments = $post->comments()
            ->where('status', 'approved')
            ->orderBy('created_at')
            ->get(['id', 'author_name', 'body', 'created_at']);
        return response()->json($comments);
    }

    /** Create a comment (pending). If Bearer token is sent, user name/email are taken from auth (name/email not required). */
    public function storeComment(Request $request, string $slug): JsonResponse
    {
        $post = $this->publishedPostsQuery()->where('slug', $slug)->first();
        if (! $post) {
            return response()->json(['message' => 'Not found.'], 404);
        }
        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $validated = $request->validate([
                'body' => ['required', 'string', 'max:2000'],
            ]);
            $comment = $post->comments()->create([
                'user_id' => $user->id,
                'author_name' => $user->name,
                'author_email' => $user->email,
                'body' => $validated['body'],
                'status' => 'pending',
            ]);
        } else {
            $validated = $request->validate([
                'author_name' => ['required', 'string', 'max:255'],
                'author_email' => ['nullable', 'string', 'email', 'max:255'],
                'body' => ['required', 'string', 'max:2000'],
            ]);
            $comment = $post->comments()->create([
                'author_name' => $validated['author_name'],
                'author_email' => $validated['author_email'] ?? null,
                'body' => $validated['body'],
                'status' => 'pending',
            ]);
        }
        return response()->json([
            'message' => 'Comment submitted and pending approval.',
            'id' => $comment->id,
        ], 201);
    }
}
