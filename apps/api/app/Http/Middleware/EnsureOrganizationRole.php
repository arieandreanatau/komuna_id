<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationRole
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

        $organizationId = $request->route('organizationId') ?? $request->route('id');

        if (! $organizationId) {
            return response()->json([
                'success' => false,
                'message' => 'Organization ID tidak ditemukan',
                'data' => null,
                'errors' => ['organization' => ['Parameter organisasi tidak valid']],
                'meta' => null,
            ], 422);
        }

        $organization = Organization::find($organizationId);

        if (! $organization) {
            return response()->json([
                'success' => false,
                'message' => 'Organisasi tidak ditemukan',
                'data' => null,
                'errors' => ['organization' => ['Organisasi tidak ditemukan']],
                'meta' => null,
            ], 404);
        }

        if (empty($roleSlugs)) {
            if ($organization->isOwner($user->id) || $organization->hasMemberRole($user->id, 'admin')) {
                return $next($request);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null,
                'errors' => ['permission' => ['Anda tidak memiliki akses ke organisasi ini']],
                'meta' => null,
            ], 403);
        }

        if ($organization->isOwner($user->id)) {
            return $next($request);
        }

        foreach ($roleSlugs as $slug) {
            if ($organization->hasMemberRole($user->id, $slug)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
            'data' => null,
            'errors' => ['permission' => ['Anda tidak memiliki role yang sesuai di organisasi ini']],
            'meta' => null,
        ], 403);
    }
}
