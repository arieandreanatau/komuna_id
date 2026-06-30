<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserRoleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->role->name,
            'slug' => $this->role->slug,
            'scope' => $this->role->scope,
            'scope_type' => $this->scope_type,
            'scope_id' => $this->scope_id,
            'is_active' => $this->is_active,
        ];
    }
}
