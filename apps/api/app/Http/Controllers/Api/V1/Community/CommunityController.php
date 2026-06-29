<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Enums\CommunityStatus;
use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityCategory;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityMember;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CommunityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Community::with(['category', 'owner'])
            ->where('status', CommunityStatus::APPROVED)
            ->where('is_public', true);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $communities = $query->orderBy('member_count', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($communities);
    }

    public function show(string $slug): JsonResponse
    {
        $community = Community::with(['category', 'owner'])
            ->where('slug', $slug)
            ->where('status', CommunityStatus::APPROVED)
            ->firstOrFail();

        return $this->successResponse($community);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category_id' => 'required|exists:community_categories,id',
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'join_mode' => 'in:open,approval_required,invite_only',
            'cover_image' => 'nullable|image|max:2048',
            'logo' => 'nullable|image|max:1024',
        ]);

        $community = Community::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
            'owner_id' => $request->user()->id,
            'status' => CommunityStatus::DRAFT,
            'member_count' => 1,
        ]);

        CommunityMember::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'role' => 'admin',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        AuditLogService::created($community, $request);

        return $this->successResponse($community->load(['category', 'owner']), 'Komunitas berhasil dibuat', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        if ($community->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:5000',
            'category_id' => 'sometimes|exists:community_categories,id',
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'join_mode' => 'in:open,approval_required,invite_only',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $oldValues = $community->only(array_keys($validated));
        $community->update($validated);

        AuditLogService::updated($community, $oldValues, $request);

        return $this->successResponse($community->fresh(), 'Komunitas berhasil diperbarui');
    }

    public function submitReview(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        if ($community->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        if ($community->status !== CommunityStatus::DRAFT && $community->status !== CommunityStatus::REVISION_NEEDED) {
            return $this->errorResponse('Status komunitas tidak memungkinkan', 422);
        }

        $community->update(['status' => CommunityStatus::PENDING_REVIEW]);
        AuditLogService::approvalAction('submitted_for_review', $community, null, $request);

        return $this->successResponse($community, 'Komunitas berhasil dikirim untuk review');
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        if ($community->status !== CommunityStatus::PENDING_REVIEW) {
            return $this->errorResponse('Status komunitas tidak memungkinkan', 422);
        }

        $community->update(['status' => CommunityStatus::APPROVED]);
        AuditLogService::approvalAction('approved', $community, $request->input('notes'), $request);

        return $this->successResponse($community, 'Komunitas berhasil disetujui');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $community->update([
            'status' => CommunityStatus::REJECTED,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        AuditLogService::approvalAction('rejected', $community, $validated['rejection_reason'], $request);

        return $this->successResponse($community, 'Komunitas ditolak');
    }

    public function needRevision(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $community->update([
            'status' => CommunityStatus::REVISION_NEEDED,
            'rejection_reason' => $validated['notes'],
        ]);

        AuditLogService::approvalAction('revision_requested', $community, $validated['notes'], $request);

        return $this->successResponse($community, 'Revisi diminta');
    }

    public function archive(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        if ($community->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $community->update(['status' => CommunityStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $community, null, $request);

        return $this->successResponse($community, 'Komunitas berhasil diarsipkan');
    }

    public function join(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        if ($community->status !== CommunityStatus::APPROVED) {
            return $this->errorResponse('Komunitas tidak tersedia', 422);
        }

        $existing = CommunityMember::where('community_id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return $this->errorResponse('Sudah menjadi anggota', 422);
        }

        if ($community->join_mode === 'approval_required') {
            $requestModel = CommunityJoinRequest::create([
                'community_id' => $id,
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'message' => $request->input('message'),
            ]);

            return $this->successResponse($requestModel, 'Permintaan join terkirim', 201);
        }

        CommunityMember::create([
            'community_id' => $id,
            'user_id' => $request->user()->id,
            'role' => 'member',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        $community->increment('member_count');

        AuditLogService::created($community, $request);

        return $this->successResponse(null, 'Berhasil bergabung', 201);
    }

    public function leave(Request $request, int $id): JsonResponse
    {
        $member = CommunityMember::where('community_id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($member->role === 'admin') {
            return $this->errorResponse('Owner tidak bisa keluar', 422);
        }

        $member->delete();

        Community::where('id', $id)->decrement('member_count');

        return $this->successResponse(null, 'Berhasil keluar dari komunitas');
    }

    public function members(Request $request, int $id): JsonResponse
    {
        $community = Community::findOrFail($id);

        $members = CommunityMember::with('user')
            ->where('community_id', $id)
            ->where('status', 'active')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($members);
    }

    public function approveMember(Request $request, int $communityId, int $userId): JsonResponse
    {
        $joinRequest = CommunityJoinRequest::where('community_id', $communityId)
            ->where('user_id', $userId)
            ->where('status', 'pending')
            ->firstOrFail();

        $joinRequest->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        CommunityMember::create([
            'community_id' => $communityId,
            'user_id' => $userId,
            'role' => 'member',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        Community::where('id', $communityId)->increment('member_count');

        AuditLogService::approvalAction('member_approved', $joinRequest, null, $request);

        return $this->successResponse(null, 'Anggota berhasil disetujui');
    }

    public function rejectMember(Request $request, int $communityId, int $userId): JsonResponse
    {
        $joinRequest = CommunityJoinRequest::where('community_id', $communityId)
            ->where('user_id', $userId)
            ->where('status', 'pending')
            ->firstOrFail();

        $joinRequest->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        AuditLogService::approvalAction('member_rejected', $joinRequest, null, $request);

        return $this->successResponse(null, 'Anggota ditolak');
    }

    public function banMember(Request $request, int $communityId, int $userId): JsonResponse
    {
        $member = CommunityMember::where('community_id', $communityId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $member->update(['status' => 'banned']);

        Community::where('id', $communityId)->decrement('member_count');

        AuditLogService::approvalAction('member_banned', $member, null, $request);

        return $this->successResponse(null, 'Anggota berhasil diblokir');
    }

    public function categories(): JsonResponse
    {
        $categories = CommunityCategory::where('is_active', true)->get();
        return $this->successResponse($categories);
    }
}
