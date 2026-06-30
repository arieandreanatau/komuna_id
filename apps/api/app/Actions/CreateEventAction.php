<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CreateEventAction
{
    public function execute(array $data, int $communityId, Request $request): Event
    {
        $event = Event::create([
            ...$data,
            'slug' => Str::slug($data['title']),
            'community_id' => $communityId,
            'organizer_id' => $request->user()->id,
            'status' => EventStatus::DRAFT,
        ]);

        AuditLogService::created($event, $request);

        return $event->load(['community', 'organizer']);
    }
}
