<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunitySetting;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunitySettingsController extends Controller
{
    public function index(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageSettings', $community);

        $settings = CommunitySetting::where('community_id', $communityId)
            ->pluck('value', 'key')
            ->toArray();

        return $this->successResponse([
            'privacy' => [
                'is_public' => $community->is_public,
                'join_mode' => $community->join_mode,
            ],
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('manageSettings', $community);

        $validated = $request->validate([
            'is_public' => 'boolean',
            'join_mode' => 'sometimes|string|in:open,approval_required,invite_only',
            'allow_member_post' => 'boolean',
            'require_event_approval' => 'boolean',
            'settings' => 'nullable|array',
        ]);

        $oldValues = [];

        if (isset($validated['is_public'])) {
            $oldValues['is_public'] = $community->is_public;
            $community->update(['is_public' => $validated['is_public']]);
        }

        if (isset($validated['join_mode'])) {
            $oldValues['join_mode'] = $community->join_mode;
            $community->update(['join_mode' => $validated['join_mode']]);
        }

        if (isset($validated['settings']) && is_array($validated['settings'])) {
            foreach ($validated['settings'] as $key => $value) {
                CommunitySetting::updateOrCreate(
                    ['community_id' => $communityId, 'key' => $key],
                    ['value' => $value]
                );
            }
        }

        AuditLogService::updated($community, $oldValues, $request);

        return $this->successResponse(null, 'Pengaturan komunitas berhasil diperbarui');
    }
}
