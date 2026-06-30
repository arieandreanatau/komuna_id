<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandMember;
use App\Models\BrandRoleHistory;
use App\Models\Invitation;
use App\Models\Notification;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandRoleController extends Controller
{
    public function index(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $members = BrandMember::with('user:id,name,email')
            ->where('brand_id', $brandId)
            ->where('status', 'active')
            ->get();

        return $this->successResponse($members);
    }

    public function store(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'role' => 'required|string|in:manager,staff',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return $this->errorResponse('User dengan email tersebut tidak ditemukan', 422);
        }

        $existing = BrandMember::where('brand_id', $brandId)
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if ($existing) {
            return $this->errorResponse('User sudah menjadi anggota brand', 422);
        }

        $invitation = Invitation::create([
            'email' => $validated['email'],
            'invitable_type' => 'App\\Models\\Brand',
            'invitable_id' => $brandId,
            'token' => Str::random(60),
            'status' => 'pending',
            'invited_by' => $request->user()->id,
            'expires_at' => now()->addDays(7),
        ]);

        AuditLogService::created($invitation, $request);

        return $this->successResponse($invitation, 'Undangan berhasil dikirim', 201);
    }

    public function update(Request $request, int $brandId, int $memberId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = BrandMember::where('brand_id', $brandId)
            ->where('id', $memberId)
            ->where('status', 'active')
            ->firstOrFail();

        if ($member->user_id === $brand->owner_id) {
            return $this->errorResponse('Role owner tidak bisa diubah', 422);
        }

        $validated = $request->validate([
            'role' => 'required|string|in:manager,staff',
        ]);

        $oldRole = $member->role;
        $member->update(['role' => $validated['role']]);

        BrandRoleHistory::create([
            'brand_id' => $brandId,
            'user_id' => $member->user_id,
            'action' => 'role_changed',
            'role' => $validated['role'],
            'notes' => "Role diubah dari {$oldRole} ke {$validated['role']}",
            'performed_by' => $request->user()->id,
        ]);

        AuditLogService::roleChange(
            $member->user_id,
            'brand_role_changed',
            ['role' => $oldRole, 'brand_id' => $brandId],
            ['role' => $validated['role'], 'brand_id' => $brandId],
            $request
        );

        return $this->successResponse($member->fresh()->load('user:id,name,email'), 'Role berhasil diperbarui');
    }

    public function destroy(Request $request, int $brandId, int $memberId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = BrandMember::where('brand_id', $brandId)
            ->where('id', $memberId)
            ->firstOrFail();

        if ($member->user_id === $brand->owner_id) {
            return $this->errorResponse('Role owner tidak bisa dicabut', 422);
        }

        $oldRole = $member->role;
        $member->update(['status' => 'inactive']);

        BrandRoleHistory::create([
            'brand_id' => $brandId,
            'user_id' => $member->user_id,
            'action' => 'revoked',
            'role' => $oldRole,
            'performed_by' => $request->user()->id,
        ]);

        AuditLogService::roleChange(
            $member->user_id,
            'brand_role_revoked',
            ['role' => $oldRole, 'brand_id' => $brandId],
            ['brand_id' => $brandId],
            $request
        );

        Notification::create([
            'user_id' => $member->user_id,
            'type' => 'brand',
            'title' => 'Role Dicabut',
            'message' => 'Role Anda sebagai ' . $oldRole . ' di brand ' . $brand->name . ' telah dicabut',
            'data' => ['brand_id' => $brandId],
        ]);

        return $this->successResponse(null, 'Role berhasil dicabut');
    }

    public function history(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $histories = BrandRoleHistory::with(['user:id,name,email', 'performer:id,name'])
            ->where('brand_id', $brandId)
            ->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($histories);
    }
}
