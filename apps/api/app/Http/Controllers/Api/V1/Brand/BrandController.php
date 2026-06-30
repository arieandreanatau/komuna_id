<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Enums\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Brand\BrandStoreRequest;
use App\Http\Requests\Brand\BrandUpdateRequest;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use App\Models\BrandMember;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function show(Request $request, int $id): JsonResponse
    {
        $brand = Brand::with(['owner', 'organization', 'members.user'])->findOrFail($id);

        return $this->successResponse(new BrandResource($brand));
    }

    public function store(BrandStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $brand = Brand::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
            'owner_id' => $request->user()->id,
            'status' => ApprovalStatus::DRAFT,
        ]);

        BrandMember::create([
            'brand_id' => $brand->id,
            'user_id' => $request->user()->id,
            'role' => 'owner',
            'status' => 'active',
        ]);

        AuditLogService::created($brand, $request);

        return $this->successResponse($brand->load(['owner']), 'Brand berhasil dibuat', 201);
    }

    public function update(BrandUpdateRequest $request, int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        if ($brand->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $oldValues = $brand->only(array_keys($validated));
        $brand->update($validated);

        AuditLogService::updated($brand, $oldValues, $request);

        return $this->successResponse($brand->fresh(), 'Brand berhasil diperbarui');
    }

    public function submitReview(Request $request, int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        if ($brand->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        if ($brand->status !== ApprovalStatus::DRAFT && $brand->status !== ApprovalStatus::REVISION_NEEDED) {
            return $this->errorResponse('Status tidak memungkinkan', 422);
        }

        $brand->update(['status' => ApprovalStatus::PENDING_REVIEW]);
        AuditLogService::approvalAction('submitted_for_review', $brand, null, $request);

        return $this->successResponse($brand, 'Brand berhasil dikirim untuk review');
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        if ($brand->status !== ApprovalStatus::PENDING_REVIEW) {
            return $this->errorResponse('Status brand tidak memungkinkan untuk disetujui', 422);
        }

        $brand->update(['status' => ApprovalStatus::APPROVED]);
        AuditLogService::approvalAction('approved', $brand, $request->input('notes'), $request);

        return $this->successResponse($brand, 'Brand disetujui');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['rejection_reason' => 'required|string|max:1000']);
        $brand = Brand::findOrFail($id);
        $brand->update([
            'status' => ApprovalStatus::REJECTED,
            'rejection_reason' => $validated['rejection_reason'],
        ]);
        AuditLogService::approvalAction('rejected', $brand, $validated['rejection_reason'], $request);

        return $this->successResponse($brand, 'Brand ditolak');
    }

    public function needRevision(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['notes' => 'required|string|max:1000']);
        $brand = Brand::findOrFail($id);
        $brand->update([
            'status' => ApprovalStatus::REVISION_NEEDED,
            'rejection_reason' => $validated['notes'],
        ]);
        AuditLogService::approvalAction('revision_requested', $brand, $validated['notes'], $request);

        return $this->successResponse($brand, 'Revisi diminta');
    }

    public function archive(Request $request, int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);
        if ($brand->owner_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }
        $brand->update(['status' => ApprovalStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $brand, null, $request);

        return $this->successResponse($brand, 'Brand diarsipkan');
    }

    public function members(Request $request, int $id): JsonResponse
    {
        $members = BrandMember::with('user')
            ->where('brand_id', $id)
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($members);
    }
}
