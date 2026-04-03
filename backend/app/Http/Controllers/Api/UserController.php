<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::with('profile')
            ->when($request->role, fn ($q) => $q->where('role', $request->role))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($users);
    }

    public function show(User $user): JsonResponse
    {
        $user->load('profile');
        return response()->json($user);
    }

    public function approve(User $user): JsonResponse
    {
        if ($user->role !== User::ROLE_INVESTOR) {
            return response()->json(['message' => 'Only investors can be approved.'], 422);
        }
        $user->update(['status' => User::STATUS_APPROVED]);
        return response()->json($user->load('profile'));
    }

    public function reject(User $user): JsonResponse
    {
        if ($user->role !== User::ROLE_INVESTOR) {
            return response()->json(['message' => 'Only investors can be rejected.'], 422);
        }
        $user->update(['status' => User::STATUS_REJECTED]);
        return response()->json($user->load('profile'));
    }
}
