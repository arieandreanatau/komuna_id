<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\CommunityStatus;
use App\Models\Community;
use App\Models\CommunityMember;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CreateCommunityAction
{
    public function execute(array $data, Request $request): Community
    {
        $community = Community::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'description' => $data['description'],
            'category_id' => $data['category_id'],
            'reason' => $data['reason'] ?? null,
            'location' => $data['location'] ?? null,
            'website' => $data['website'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'instagram' => $data['instagram'] ?? null,
            'is_public' => $data['is_public'] ?? true,
            'join_mode' => $data['join_mode'] ?? 'open',
            'owner_id' => $request->user()->id,
            'status' => CommunityStatus::PENDING_REVIEW,
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

        return $community->load(['category', 'owner']);
    }
}
