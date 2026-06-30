<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityMember;
use App\Models\Notification;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityMemberController extends Controller
{
    public function index(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $query = CommunityMember::with('user:id,name,email,status')
            ->where('community_id', $communityId);

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

        $members = $query->latest('joined_at')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($members);
    }

    public function show(Request $request, int $communityId, int $memberId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $member = CommunityMember::with('user:id,name,email,status')
            ->where('community_id', $communityId)
            ->where('id', $memberId)
            ->firstOrFail();

        return $this->successResponse($member);
    }

    public function joinRequests(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $query = CommunityJoinRequest::with('user:id,name,email')
            ->where('community_id', $communityId);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($requests);
    }

    public function approveJoinRequest(Request $request, int $communityId, int $requestId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $joinRequest = CommunityJoinRequest::where('community_id', $communityId)
            ->where('id', $requestId)
            ->where('status', 'pending')
            ->firstOrFail();

        $joinRequest->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $existingMember = CommunityMember::where('community_id', $communityId)
            ->where('user_id', $joinRequest->user_id)
            ->first();

        if (!$existingMember) {
            CommunityMember::create([
                'community_id' => $communityId,
                'user_id' => $joinRequest->user_id,
                'role' => 'member',
                'status' => 'active',
                'joined_at' => now(),
            ]);

            Community::where('id', $communityId)->increment('member_count');
        } else {
            $existingMember->update(['status' => 'active', 'joined_at' => now()]);
        }

        Notification::create([
            'user_id' => $joinRequest->user_id,
            'type' => 'community',
            'title' => 'Permintaan Join Disetujui',
            'message' => 'Permintaan Anda untuk bergabung ke komunitas ' . $community->name . ' telah disetujui',
            'data' => ['community_id' => $communityId],
        ]);

        AuditLogService::approvalAction('member_approved', $joinRequest, null, $request);

        return $this->successResponse(null, 'Permintaan join berhasil disetujui');
    }

    public function rejectJoinRequest(Request $request, int $communityId, int $requestId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $joinRequest = CommunityJoinRequest::where('community_id', $communityId)
            ->where('id', $requestId)
            ->where('status', 'pending')
            ->firstOrFail();

        $joinRequest->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        Notification::create([
            'user_id' => $joinRequest->user_id,
            'type' => 'community',
            'title' => 'Permintaan Join Ditolak',
            'message' => 'Permintaan Anda untuk bergabung ke komunitas ' . $community->name . ' telah ditolak',
            'data' => ['community_id' => $communityId],
        ]);

        AuditLogService::approvalAction('member_rejected', $joinRequest, null, $request);

        return $this->successResponse(null, 'Permintaan join ditolak');
    }

    public function remove(Request $request, int $communityId, int $memberId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $member = CommunityMember::where('community_id', $communityId)
            ->where('id', $memberId)
            ->firstOrFail();

        if ($member->user_id === $community->owner_id) {
            return $this->errorResponse('Owner komunitas tidak bisa dihapus', 422);
        }

        if ($member->role === 'admin' && !$request->user()->isCommunityOwner($communityId)) {
            return $this->errorResponse('Hanya owner yang bisa menghapus admin', 422);
        }

        $userId = $member->user_id;
        $member->delete();

        Community::where('id', $communityId)->decrement('member_count');

        AuditLogService::approvalAction('member_removed', $community, "Removed user ID: {$userId}", $request);

        return $this->successResponse(null, 'Anggota berhasil dihapus dari komunitas');
    }

    public function ban(Request $request, int $communityId, int $memberId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $member = CommunityMember::where('community_id', $communityId)
            ->where('id', $memberId)
            ->firstOrFail();

        if ($member->user_id === $community->owner_id) {
            return $this->errorResponse('Owner komunitas tidak bisa di-ban', 422);
        }

        $member->update(['status' => 'banned']);

        Community::where('id', $communityId)->decrement('member_count');

        AuditLogService::approvalAction('member_banned', $member, null, $request);

        return $this->successResponse(null, 'Anggota berhasil di-ban');
    }

    public function unban(Request $request, int $communityId, int $memberId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $member = CommunityMember::where('community_id', $communityId)
            ->where('id', $memberId)
            ->where('status', 'banned')
            ->firstOrFail();

        $member->update(['status' => 'active']);

        Community::where('id', $communityId)->increment('member_count');

        AuditLogService::approvalAction('member_unbanned', $member, null, $request);

        return $this->successResponse(null, 'Anggota berhasil di-unban');
    }

    public function history(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageMembers', $community);

        $allMembers = CommunityMember::with('user:id,name,email')
            ->where('community_id', $communityId)
            ->orderBy('created_at', 'desc')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($allMembers);
    }
}
