<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Notification;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\OrganizationRoleHistory;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationRoleController extends Controller
{
    public function index(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $members = OrganizationMember::with('user:id,name,email')
            ->where('organization_id', $organizationId)
            ->where('status', 'active')
            ->get();

        return $this->successResponse($members);
    }

    public function store(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'role' => 'required|string|in:admin,finance,partnership',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return $this->errorResponse('User dengan email tersebut tidak ditemukan', 422);
        }

        $existing = OrganizationMember::where('organization_id', $organizationId)
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if ($existing) {
            return $this->errorResponse('User sudah menjadi anggota organisasi', 422);
        }

        $invitation = Invitation::create([
            'email' => $validated['email'],
            'invitable_type' => 'App\\Models\\Organization',
            'invitable_id' => $organizationId,
            'token' => Str::random(60),
            'status' => 'pending',
            'invited_by' => $request->user()->id,
            'expires_at' => now()->addDays(7),
        ]);

        AuditLogService::created($invitation, $request);

        return $this->successResponse($invitation, 'Undangan berhasil dikirim', 201);
    }

    public function update(Request $request, int $organizationId, int $memberId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = OrganizationMember::where('organization_id', $organizationId)
            ->where('id', $memberId)
            ->where('status', 'active')
            ->firstOrFail();

        if ($member->user_id === $org->owner_id) {
            return $this->errorResponse('Role owner tidak bisa diubah', 422);
        }

        $validated = $request->validate([
            'role' => 'required|string|in:admin,finance,partnership',
        ]);

        $oldRole = $member->role;
        $member->update(['role' => $validated['role']]);

        OrganizationRoleHistory::create([
            'organization_id' => $organizationId,
            'user_id' => $member->user_id,
            'action' => 'role_changed',
            'role' => $validated['role'],
            'notes' => "Role diubah dari {$oldRole} ke {$validated['role']}",
            'performed_by' => $request->user()->id,
        ]);

        AuditLogService::roleChange(
            $member->user_id,
            'organization_role_changed',
            ['role' => $oldRole, 'organization_id' => $organizationId],
            ['role' => $validated['role'], 'organization_id' => $organizationId],
            $request
        );

        return $this->successResponse($member->fresh()->load('user:id,name,email'), 'Role berhasil diperbarui');
    }

    public function destroy(Request $request, int $organizationId, int $memberId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = OrganizationMember::where('organization_id', $organizationId)
            ->where('id', $memberId)
            ->firstOrFail();

        if ($member->user_id === $org->owner_id) {
            return $this->errorResponse('Role owner tidak bisa dicabut', 422);
        }

        $oldRole = $member->role;
        $member->update(['status' => 'inactive']);

        OrganizationRoleHistory::create([
            'organization_id' => $organizationId,
            'user_id' => $member->user_id,
            'action' => 'revoked',
            'role' => $oldRole,
            'performed_by' => $request->user()->id,
        ]);

        AuditLogService::roleChange(
            $member->user_id,
            'organization_role_revoked',
            ['role' => $oldRole, 'organization_id' => $organizationId],
            ['organization_id' => $organizationId],
            $request
        );

        Notification::create([
            'user_id' => $member->user_id,
            'type' => 'organization',
            'title' => 'Role Dicabut',
            'message' => 'Role Anda sebagai ' . $oldRole . ' di organisasi ' . $org->name . ' telah dicabut',
            'data' => ['organization_id' => $organizationId],
        ]);

        return $this->successResponse(null, 'Role berhasil dicabut');
    }

    public function history(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $histories = OrganizationRoleHistory::with(['user:id,name,email', 'performer:id,name'])
            ->where('organization_id', $organizationId)
            ->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($histories);
    }
}
