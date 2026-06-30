<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'data' => null,
                'errors' => ['authentication' => ['Anda harus login terlebih dahulu']],
                'meta' => null,
            ], 401);
        }

        if ($user->status !== UserStatus::ACTIVE) {
            return response()->json([
                'success' => false,
                'message' => 'Akun tidak aktif',
                'data' => null,
                'errors' => ['status' => ['Akun Anda tidak aktif atau telah ditangguhkan']],
                'meta' => null,
            ], 403);
        }

        $hasRole = $user->roles()
            ->where('is_active', true)
            ->whereHas('role', function ($q) use ($roles) {
                $q->whereIn('slug', $roles)->where('is_active', true);
            })
            ->exists();

        if (! $hasRole && ! $user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null,
                'errors' => ['permission' => ['Anda tidak memiliki akses ke resource ini']],
                'meta' => null,
            ], 403);
        }

        return $next($request);
    }
}
