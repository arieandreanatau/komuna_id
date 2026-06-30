<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use App\Models\Brand;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBrandRole
{
    public function handle(Request $request, Closure $next, string ...$roleSlugs): Response
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

        if ($user->isAdmin()) {
            return $next($request);
        }

        $brandId = $request->route('brandId') ?? $request->route('id');

        if (! $brandId) {
            return response()->json([
                'success' => false,
                'message' => 'Brand ID tidak ditemukan',
                'data' => null,
                'errors' => ['brand' => ['Parameter brand tidak valid']],
                'meta' => null,
            ], 422);
        }

        $brand = Brand::find($brandId);

        if (! $brand) {
            return response()->json([
                'success' => false,
                'message' => 'Brand tidak ditemukan',
                'data' => null,
                'errors' => ['brand' => ['Brand tidak ditemukan']],
                'meta' => null,
            ], 404);
        }

        if (empty($roleSlugs)) {
            if ($brand->isOwner($user->id) || $brand->hasMemberRole($user->id, 'manager')) {
                return $next($request);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null,
                'errors' => ['permission' => ['Anda tidak memiliki akses ke brand ini']],
                'meta' => null,
            ], 403);
        }

        if ($brand->isOwner($user->id)) {
            return $next($request);
        }

        foreach ($roleSlugs as $slug) {
            if ($brand->hasMemberRole($user->id, $slug)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
            'data' => null,
            'errors' => ['permission' => ['Anda tidak memiliki role yang sesuai di brand ini']],
            'meta' => null,
        ], 403);
    }
}
