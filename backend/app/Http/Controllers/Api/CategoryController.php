<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::withCount('posts')
            ->orderBy('name')
            ->paginate(15);

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $category = Category::create($validated);

        return response()->json($category->loadCount('posts'), 201);
    }

    public function show(Category $category): JsonResponse
    {
        $category->loadCount('posts');
        return response()->json($category);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        $category->update($validated);

        return response()->json($category->loadCount('posts'));
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->posts()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category that has posts.',
            ], 422);
        }

        $category->delete();
        return response()->json(null, 204);
    }
}
