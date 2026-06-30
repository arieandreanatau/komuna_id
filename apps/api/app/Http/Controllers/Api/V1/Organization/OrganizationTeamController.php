<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationTeamController extends Controller
{
    public function index(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $query = OrganizationMember::with('user:id,name,email,status')
            ->where('organization_id', $organizationId);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $members = $query->latest('created_at')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($members);
    }

    public function show(Request $request, int $organizationId, int $memberId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = OrganizationMember::with('user:id,name,email,status')
            ->where('organization_id', $organizationId)
            ->where('id', $memberId)
            ->firstOrFail();

        return $this->successResponse($member);
    }

    public function remove(Request $request, int $organizationId, int $memberId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = OrganizationMember::where('organization_id', $organizationId)
            ->where('id', $memberId)
            ->firstOrFail();

        if ($member->user_id === $org->owner_id) {
            return $this->errorResponse('Owner organisasi tidak bisa dihapus', 422);
        }

        if ($member->role === 'admin' && $org->owner_id !== $request->user()->id) {
            return $this->errorResponse('Hanya owner yang bisa menghapus admin', 422);
        }

        $userId = $member->user_id;
        $member->delete();

        AuditLogService::approvalAction('member_removed', $org, "Removed user ID: {$userId}", $request);

        return $this->successResponse(null, 'Anggota berhasil dihapus dari organisasi');
    }
}
