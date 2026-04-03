<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureInvestorIsApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        // Admin can always access
        if ($user->role === User::ROLE_ADMIN) {
            return $next($request);
        }
        // Investor must be approved
        if ($user->role === User::ROLE_INVESTOR && $user->status !== User::STATUS_APPROVED) {
            return response()->json([
                'message' => 'Your account is pending approval.',
            ], 403);
        }

        return $next($request);
    }
}
