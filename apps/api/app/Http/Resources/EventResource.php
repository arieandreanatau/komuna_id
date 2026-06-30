<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'status' => $this->status->value,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'location' => $this->location,
            'location_url' => $this->location_url,
            'is_online' => $this->is_online,
            'online_url' => $this->online_url,
            'max_participants' => $this->max_participants,
            'current_participants' => $this->current_participants,
            'ticket_price' => $this->ticket_price,
            'currency' => $this->currency,
            'community' => new CommunityResource($this->whenLoaded('community')),
            'organizer' => new UserResource($this->whenLoaded('organizer')),
            'tickets' => EventTicketResource::collection($this->whenLoaded('tickets')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
