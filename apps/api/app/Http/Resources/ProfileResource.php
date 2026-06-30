<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'bio' => $this->bio,
            'avatar' => $this->avatar,
            'phone' => $this->phone,
            'location' => $this->location,
            'website' => $this->website,
            'social_links' => $this->social_links,
        ];
    }
}
