<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'username' => $this->username,
            'full_name' => $this->full_name,
            'name' => $this->full_name ?? $this->username,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'status' => $this->status->value,
            'verification_level' => $this->verification_level,
            'email_verified_at' => $this->email_verified_at,
            'phone_verified_at' => $this->phone_verified_at,
            'identity_verified_at' => $this->identity_verified_at,
            'profile' => new ProfileResource($this->whenLoaded('profile')),
            'roles' => UserRoleResource::collection($this->whenLoaded('roles')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
