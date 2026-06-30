<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Enums\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandMember;
use App\Models\Organization;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationBrandController extends Controller
{
    public function index(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $query = Brand::with('owner:id,name,email')
            ->where('organization_id', $organizationId);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $brands = $query->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($brands);
    }

    public function store(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|string|max:500',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'social_media' => 'nullable|array',
            'main_products' => 'nullable|string|max:500',
            'target_audience' => 'nullable|string|max:500',
            'campaign_area' => 'nullable|string|max:255',
        ]);

        $brand = Brand::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
            'owner_id' => $request->user()->id,
            'organization_id' => $organizationId,
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

    public function show(Request $request, int $organizationId, int $brandId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $brand = Brand::with(['owner:id,name,email', 'members.user:id,name,email'])
            ->where('organization_id', $organizationId)
            ->findOrFail($brandId);

        return $this->successResponse($brand);
    }

    public function update(Request $request, int $organizationId, int $brandId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $brand = Brand::where('organization_id', $organizationId)->findOrFail($brandId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|string|max:500',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'social_media' => 'nullable|array',
            'main_products' => 'nullable|string|max:500',
            'target_audience' => 'nullable|string|max:500',
            'campaign_area' => 'nullable|string|max:255',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $oldValues = $brand->only(array_keys($validated));
        $brand->update($validated);

        AuditLogService::updated($brand, $oldValues, $request);

        return $this->successResponse($brand->fresh(), 'Brand berhasil diperbarui');
    }

    public function archive(Request $request, int $organizationId, int $brandId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $brand = Brand::where('organization_id', $organizationId)->findOrFail($brandId);

        $brand->update(['status' => ApprovalStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $brand, null, $request);

        return $this->successResponse($brand, 'Brand berhasil diarsipkan');
    }
}
