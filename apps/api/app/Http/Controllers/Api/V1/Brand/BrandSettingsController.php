<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandSetting;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandSettingsController extends Controller
{
    public function index(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $setting = BrandSetting::where('brand_id', $brandId)->first();

        return $this->successResponse([
            'is_public' => $setting?->is_public ?? true,
            'allow_collaboration_inquiries' => $setting?->allow_collaboration_inquiries ?? true,
            'notification_preferences' => $setting?->notification_preferences ?? [],
        ]);
    }

    public function update(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'is_public' => 'boolean',
            'allow_collaboration_inquiries' => 'boolean',
            'notification_preferences' => 'nullable|array',
        ]);

        $setting = BrandSetting::updateOrCreate(
            ['brand_id' => $brandId],
            $validated
        );

        AuditLogService::updated($brand, $validated, $request);

        return $this->successResponse($setting->fresh(), 'Pengaturan brand berhasil diperbarui');
    }
}
