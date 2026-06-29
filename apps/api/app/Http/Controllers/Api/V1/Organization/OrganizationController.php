<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Enums\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\OrganizationStoreRequest;
use App\Http\Requests\Organization\OrganizationUpdateRequest;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationController extends Controller
{
    public function show(Request $request, int $id): JsonResponse
    {
        $org = Organization::with(['owner', 'members.user', 'brands'])->findOrFail($id);
        return $this->successResponse($org);
    }

    public function store(OrganizationStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $org = Organization::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
            'owner_id' => $request->user()->id,
            'status' => ApprovalStatus::DRAFT,
        ]);

        OrganizationMember::create([
            'organization_id' => $org->id,
            'user_id' => $request->user()->id,
            'role' => 'owner',
            'status' => 'active',
        ]);

        AuditLogService::created($org, $request);

        return $this->successResponse($org->load(['owner']), 'Organisasi berhasil dibuat', 201);
    }

    public function update(OrganizationUpdateRequest $request, int $id): JsonResponse
    {
        $org = Organization::findOrFail($id);

        if ($org->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $oldValues = $org->only(array_keys($validated));
        $org->update($validated);

        AuditLogService::updated($org, $oldValues, $request);

        return $this->successResponse($org->fresh(), 'Organisasi berhasil diperbarui');
    }

    public function submitReview(Request $request, int $id): JsonResponse
    {
        $org = Organization::findOrFail($id);

        if ($org->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        if ($org->status !== ApprovalStatus::DRAFT && $org->status !== ApprovalStatus::REVISION) {
            return $this->errorResponse('Status tidak memungkinkan', 422);
        }

        $org->update(['status' => ApprovalStatus::PENDING]);
        AuditLogService::approvalAction('submitted_for_review', $org, null, $request);

        return $this->successResponse($org, 'Berhasil dikirim untuk review');
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $org = Organization::findOrFail($id);
        $org->update(['status' => ApprovalStatus::APPROVED]);
        AuditLogService::approvalAction('approved', $org, $request->input('notes'), $request);
        return $this->successResponse($org, 'Organisasi disetujui');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['rejection_reason' => 'required|string|max:1000']);
        $org = Organization::findOrFail($id);
        $org->update([
            'status' => ApprovalStatus::REJECTED,
            'rejection_reason' => $validated['rejection_reason'],
        ]);
        AuditLogService::approvalAction('rejected', $org, $validated['rejection_reason'], $request);
        return $this->successResponse($org, 'Organisasi ditolak');
    }

    public function needRevision(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['notes' => 'required|string|max:1000']);
        $org = Organization::findOrFail($id);
        $org->update([
            'status' => ApprovalStatus::REVISION,
            'rejection_reason' => $validated['notes'],
        ]);
        AuditLogService::approvalAction('revision_requested', $org, $validated['notes'], $request);
        return $this->successResponse($org, 'Revisi diminta');
    }

    public function archive(Request $request, int $id): JsonResponse
    {
        $org = Organization::findOrFail($id);
        if ($org->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }
        $org->update(['status' => ApprovalStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $org, null, $request);
        return $this->successResponse($org, 'Organisasi diarsipkan');
    }

    public function members(Request $request, int $id): JsonResponse
    {
        $members = OrganizationMember::with('user')
            ->where('organization_id', $id)
            ->paginate($request->get('per_page', 15));
        return $this->paginatedResponse($members);
    }
}
