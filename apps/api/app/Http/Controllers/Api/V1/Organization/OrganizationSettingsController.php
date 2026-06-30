<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationSetting;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationSettingsController extends Controller
{
    public function index(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $setting = OrganizationSetting::where('organization_id', $organizationId)->first();

        return $this->successResponse([
            'is_public' => $setting?->is_public ?? true,
            'allow_collaboration_inquiries' => $setting?->allow_collaboration_inquiries ?? true,
            'show_members_publicly' => $setting?->show_members_publicly ?? false,
            'notification_preferences' => $setting?->notification_preferences ?? [],
        ]);
    }

    public function update(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'is_public' => 'boolean',
            'allow_collaboration_inquiries' => 'boolean',
            'show_members_publicly' => 'boolean',
            'notification_preferences' => 'nullable|array',
        ]);

        $setting = OrganizationSetting::updateOrCreate(
            ['organization_id' => $organizationId],
            $validated
        );

        AuditLogService::updated($org, $validated, $request);

        return $this->successResponse($setting->fresh(), 'Pengaturan organisasi berhasil diperbarui');
    }
}
