<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use App\Models\Community;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCommunityRole
{
    public function handle(Request $request, Closure $next, string ...$roleSlugs): Response
    {
        $user = $request->user();

        if (!$user) {
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

        $communityId = $request->route('communityId') ?? $request->route('id');

        if (!$communityId) {
            return response()->json([
                'success' => false,
                'message' => 'Community ID tidak ditemukan',
                'data' => null,
                'errors' => ['community' => ['Parameter komunitas tidak valid']],
                'meta' => null,
            ], 422);
        }

        $community = Community::find($communityId);

        if (!$community) {
            return response()->json([
                'success' => false,
                'message' => 'Komunitas tidak ditemukan',
                'data' => null,
                'errors' => ['community' => ['Komunitas tidak ditemukan']],
                'meta' => null,
            ], 404);
        }

        if (empty($roleSlugs)) {
            if ($community->isOwner($user->id) || $community->isCommunityAdmin($user->id)) {
                return $next($request);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null,
                'errors' => ['permission' => ['Anda tidak memiliki akses ke komunitas ini']],
                'meta' => null,
            ], 403);
        }

        foreach ($roleSlugs as $slug) {
            if ($community->isOwner($user->id) && $slug === 'community-owner') {
                return $next($request);
            }

            if ($community->hasRole($user->id, $slug)) {
                return $next($request);
            }
        }

        if ($community->isCommunityAdmin($user->id)) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
            'data' => null,
            'errors' => ['permission' => ['Anda tidak memiliki role yang sesuai di komunitas ini']],
            'meta' => null,
        ], 403);
    }
}
