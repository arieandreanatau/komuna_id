<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Services\AuditLogService;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationProfileController extends Controller
{
    public function show(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::with(['owner:id,full_name,username,email', 'members.user:id,full_name,username,email'])
            ->findOrFail($organizationId);

        return $this->successResponse($org);
    }

    public function update(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|string|max:255',
            'legal_name' => 'sometimes|string|max:255',
            'website' => 'nullable|string|max:500',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'social_media' => 'nullable|array',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $oldValues = $org->only(array_keys($validated));
        $org->update($validated);

        AuditLogService::updated($org, $oldValues, $request);

        return $this->successResponse($org->fresh()->load(['owner:id,full_name,username']), 'Profil organisasi berhasil diperbarui');
    }

    public function updateLogo(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $request->validate([
            'logo' => 'required|file|image|max:2048',
        ]);

        if ($org->logo) {
            FileUploadService::delete($org->logo);
        }

        $path = FileUploadService::uploadPublic($request->file('logo'), 'organization/logos');
        $org->update(['logo' => $path]);

        AuditLogService::updated($org, ['logo' => null], $request);

        return $this->successResponse($org, 'Logo berhasil diubah');
    }

    public function archive(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id) {
            return $this->errorResponse('Hanya owner yang bisa mengarsipkan organisasi', 403);
        }

        $org->update(['status' => 'archived']);
        AuditLogService::approvalAction('archived', $org, null, $request);

        return $this->successResponse($org, 'Organisasi berhasil diarsipkan');
    }

    public function deleteRequest(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id) {
            return $this->errorResponse('Hanya owner yang bisa mengajukan penghapusan', 403);
        }

        AuditLogService::approvalAction('delete_requested', $org, 'Owner request to delete organization', $request);

        return $this->successResponse(null, 'Pengajuan penghapusan organisasi berhasil dikirim. Menunggu review Platform Admin.');
    }
}
