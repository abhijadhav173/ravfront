<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return response()->json([
                'role' => 'admin',
                'counts' => [
                    'users' => User::count(),
                    'users_pending' => User::where('role', User::ROLE_INVESTOR)->where('status', User::STATUS_PENDING)->count(),
                    'categories' => Category::count(),
                    'posts' => Post::count(),
                    'posts_published' => Post::whereNotNull('published_at')->count(),
                ],
            ]);
        }

        return response()->json([
            'role' => 'investor',
            'counts' => [
                'categories' => Category::count(),
                'posts' => Post::whereNotNull('published_at')->count(),
            ],
        ]);
    }
}
