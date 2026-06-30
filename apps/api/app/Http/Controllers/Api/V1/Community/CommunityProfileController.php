<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Services\AuditLogService;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityProfileController extends Controller
{
    public function show(Request $request, int $communityId): JsonResponse
    {
        $community = Community::with(['category', 'owner:id,name,email'])
            ->findOrFail($communityId);

        $this->authorize('view', $community);

        return $this->successResponse($community);
    }

    public function update(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('update', $community);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'cover_image' => 'nullable|string|max:500',
            'logo' => 'nullable|string|max:500',
            'category_id' => 'sometimes|exists:community_categories,id',
            'website' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'join_mode' => 'sometimes|string|in:open,approval_required,invite_only',
        ]);

        $oldValues = $community->only(array_keys($validated));
        $community->update($validated);

        AuditLogService::updated($community, $oldValues, $request);

        return $this->successResponse($community->fresh()->load(['category', 'owner:id,name']), 'Profil komunitas berhasil diperbarui');
    }

    public function updateLogo(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('update', $community);

        $request->validate([
            'logo' => 'required|file|image|max:2048',
        ]);

        if ($community->logo) {
            FileUploadService::delete($community->logo);
        }

        $path = FileUploadService::uploadPublic($request->file('logo'), 'community/logos');
        $community->update(['logo' => $path]);

        AuditLogService::updated($community, ['logo' => null], $request);

        return $this->successResponse($community, 'Logo berhasil diubah');
    }

    public function updateCoverImage(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('update', $community);

        $request->validate([
            'cover_image' => 'required|file|image|max:4096',
        ]);

        if ($community->cover_image) {
            FileUploadService::delete($community->cover_image);
        }

        $path = FileUploadService::uploadPublic($request->file('cover_image'), 'community/covers');
        $community->update(['cover_image' => $path]);

        AuditLogService::updated($community, ['cover_image' => null], $request);

        return $this->successResponse($community, 'Banner berhasil diubah');
    }

    public function archive(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('update', $community);

        $community->update(['status' => 'archived']);
        AuditLogService::approvalAction('archived', $community, null, $request);

        return $this->successResponse($community, 'Komunitas berhasil diarsipkan');
    }

    public function deleteRequest(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        if ($community->owner_id !== $request->user()->id) {
            return $this->errorResponse('Hanya owner yang bisa mengajukan penghapusan', 403);
        }

        AuditLogService::approvalAction('delete_requested', $community, 'Owner request to delete community', $request);

        return $this->successResponse(null, 'Pengajuan penghapusan komunitas berhasil dikirim. Menunggu review Platform Admin.');
    }

    public function preview(Request $request, int $communityId): JsonResponse
    {
        $community = Community::with(['category', 'owner:id,name'])
            ->where('status', 'approved')
            ->where('is_public', true)
            ->findOrFail($communityId);

        return $this->successResponse($community);
    }
}
