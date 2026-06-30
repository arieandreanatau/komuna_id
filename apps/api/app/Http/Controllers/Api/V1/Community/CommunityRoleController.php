<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\CommunityRoleAssignment;
use App\Models\CommunityRoleHistory;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityRoleController extends Controller
{
    public function index(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageRoles', $community);

        $assignments = CommunityRoleAssignment::with(['user:id,name,email', 'role:id,name,slug', 'assigner:id,name'])
            ->where('community_id', $communityId)
            ->where('is_active', true)
            ->get();

        return $this->successResponse($assignments);
    }

    public function store(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageRoles', $community);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_slug' => 'required|string|in:community-admin,event-manager,volunteer-coordinator',
            'notes' => 'nullable|string|max:500',
        ]);

        $role = Role::where('slug', $validated['role_slug'])->firstOrFail();

        $existing = CommunityRoleAssignment::where('community_id', $communityId)
            ->where('user_id', $validated['user_id'])
            ->where('role_id', $role->id)
            ->where('is_active', true)
            ->first();

        if ($existing) {
            return $this->errorResponse('Role sudah di-assign ke user ini', 422);
        }

        $isMember = CommunityMember::where('community_id', $communityId)
            ->where('user_id', $validated['user_id'])
            ->where('status', 'active')
            ->exists();

        if (!$isMember) {
            return $this->errorResponse('User harus menjadi anggota komunitas terlebih dahulu', 422);
        }

        $oldRoles = CommunityRoleAssignment::where('community_id', $communityId)
            ->where('user_id', $validated['user_id'])
            ->where('is_active', true)
            ->with('role:id,name,slug')
            ->get()
            ->pluck('role.slug')
            ->toArray();

        $assignment = CommunityRoleAssignment::create([
            'community_id' => $communityId,
            'user_id' => $validated['user_id'],
            'role_id' => $role->id,
            'assigned_by' => $request->user()->id,
            'is_active' => true,
            'notes' => $validated['notes'] ?? null,
            'assigned_at' => now(),
        ]);

        CommunityRoleHistory::create([
            'community_id' => $communityId,
            'user_id' => $validated['user_id'],
            'role_id' => $role->id,
            'changed_by' => $request->user()->id,
            'action' => 'assigned',
            'notes' => $validated['notes'] ?? null,
        ]);

        $newRoles = array_merge($oldRoles, [$validated['role_slug']]);
        AuditLogService::roleChange(
            $validated['user_id'],
            'community_role_assigned',
            ['roles' => $oldRoles, 'community_id' => $communityId],
            ['roles' => $newRoles, 'community_id' => $communityId, 'role_slug' => $validated['role_slug']],
            $request
        );

        $user = User::find($validated['user_id']);
        \App\Models\Notification::create([
            'user_id' => $validated['user_id'],
            'type' => 'community',
            'title' => 'Role Komunitas Baru',
            'message' => 'Anda di-assign sebagai ' . $role->name . ' di komunitas ' . $community->name,
            'data' => ['community_id' => $communityId, 'role_slug' => $validated['role_slug']],
        ]);

        return $this->successResponse($assignment->load(['user:id,name,email', 'role:id,name,slug']), 'Role berhasil di-assign', 201);
    }

    public function update(Request $request, int $communityId, int $assignmentId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageRoles', $community);

        $assignment = CommunityRoleAssignment::where('community_id', $communityId)
            ->where('id', $assignmentId)
            ->where('is_active', true)
            ->firstOrFail();

        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        if (!$validated['is_active']) {
            $assignment->update([
                'is_active' => false,
                'deactivated_at' => now(),
            ]);

            CommunityRoleHistory::create([
                'community_id' => $communityId,
                'user_id' => $assignment->user_id,
                'role_id' => $assignment->role_id,
                'changed_by' => $request->user()->id,
                'action' => 'deactivated',
            ]);

            AuditLogService::roleChange(
                $assignment->user_id,
                'community_role_deactivated',
                ['community_id' => $communityId, 'role_id' => $assignment->role_id],
                ['community_id' => $communityId, 'role_id' => $assignment->role_id, 'is_active' => false],
                $request
            );
        }

        return $this->successResponse($assignment->fresh()->load(['user:id,name,email', 'role:id,name,slug']), 'Role berhasil diperbarui');
    }

    public function destroy(Request $request, int $communityId, int $assignmentId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageRoles', $community);

        $assignment = CommunityRoleAssignment::where('community_id', $communityId)
            ->where('id', $assignmentId)
            ->firstOrFail();

        $role = $assignment->role;

        $assignment->update([
            'is_active' => false,
            'deactivated_at' => now(),
        ]);

        CommunityRoleHistory::create([
            'community_id' => $communityId,
            'user_id' => $assignment->user_id,
            'role_id' => $assignment->role_id,
            'changed_by' => $request->user()->id,
            'action' => 'revoked',
        ]);

        AuditLogService::roleChange(
            $assignment->user_id,
            'community_role_revoked',
            ['community_id' => $communityId, 'role_slug' => $role->slug],
            ['community_id' => $communityId],
            $request
        );

        return $this->successResponse(null, 'Role berhasil dicabut');
    }

    public function history(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewAuditLog', $community);

        $histories = CommunityRoleHistory::with(['user:id,name,email', 'role:id,name,slug', 'changer:id,name'])
            ->where('community_id', $communityId)
            ->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($histories);
    }
}
