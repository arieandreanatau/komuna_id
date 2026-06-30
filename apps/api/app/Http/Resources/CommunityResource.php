<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommunityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'logo' => $this->logo,
            'status' => $this->status->value,
            'rejection_reason' => $this->rejection_reason,
            'website' => $this->website,
            'location' => $this->location,
            'member_count' => $this->member_count,
            'is_public' => $this->is_public,
            'join_mode' => $this->join_mode,
            'category' => new CommunityCategoryResource($this->whenLoaded('category')),
            'owner' => new UserResource($this->whenLoaded('owner')),
            'members_count' => $this->whenCounted('members'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
