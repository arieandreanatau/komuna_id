<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
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

        if (! $user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null,
                'errors' => ['permission' => ['Anda tidak memiliki akses admin']],
                'meta' => null,
            ], 403);
        }

        return $next($request);
    }
}
