<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Services\AuditLogService;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandProfileController extends Controller
{
    public function show(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::with(['owner:id,full_name,username,email', 'organization:id,name', 'members.user:id,full_name,username,email'])
            ->findOrFail($brandId);

        return $this->successResponse($brand);
    }

    public function update(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && ! $brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

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

        return $this->successResponse($brand->fresh()->load(['owner:id,full_name,username']), 'Profil brand berhasil diperbarui');
    }

    public function updateLogo(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && ! $brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $request->validate([
            'logo' => 'required|file|image|max:2048',
        ]);

        if ($brand->logo) {
            FileUploadService::delete($brand->logo);
        }

        $path = FileUploadService::uploadPublic($request->file('logo'), 'brand/logos');
        $brand->update(['logo' => $path]);

        AuditLogService::updated($brand, ['logo' => null], $request);

        return $this->successResponse($brand, 'Logo berhasil diubah');
    }

    public function updateBanner(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && ! $brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $request->validate([
            'banner' => 'required|file|image|max:4096',
        ]);

        if ($brand->banner) {
            FileUploadService::delete($brand->banner);
        }

        $path = FileUploadService::uploadPublic($request->file('banner'), 'brand/banners');
        $brand->update(['banner' => $path]);

        AuditLogService::updated($brand, ['banner' => null], $request);

        return $this->successResponse($brand, 'Banner berhasil diubah');
    }

    public function archive(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id) {
            return $this->errorResponse('Hanya owner yang bisa mengarsipkan brand', 403);
        }

        $brand->update(['status' => 'archived']);
        AuditLogService::approvalAction('archived', $brand, null, $request);

        return $this->successResponse($brand, 'Brand berhasil diarsipkan');
    }

    public function deleteRequest(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id) {
            return $this->errorResponse('Hanya owner yang bisa mengajukan penghapusan', 403);
        }

        AuditLogService::approvalAction('delete_requested', $brand, 'Owner request to delete brand', $request);

        return $this->successResponse(null, 'Pengajuan penghapusan brand berhasil dikirim. Menunggu review Platform Admin.');
    }
}
