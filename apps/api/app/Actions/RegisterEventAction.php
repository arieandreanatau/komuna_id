<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\EventStatus;
use App\Jobs\SendEventRegistrationEmailJob;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RegisterEventAction
{
    public function execute(int $id, Request $request): EventRegistration
    {
        $event = Event::findOrFail($id);

        if ($event->status !== EventStatus::PUBLISHED) {
            abort(422, 'Event tidak tersedia');
        }

        if ($event->max_participants && $event->current_participants >= $event->max_participants) {
            abort(422, 'Event sudah penuh');
        }

        $existing = EventRegistration::where('event_id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing && $existing->status !== 'cancelled') {
            abort(422, 'Sudah terdaftar di event ini');
        }

        $registration = EventRegistration::updateOrCreate(
            ['event_id' => $id, 'user_id' => $request->user()->id],
            [
                'status' => 'registered',
                'qr_code' => Str::uuid(),
                'registered_at' => now(),
            ]
        );

        $event->increment('current_participants');

        AuditLogService::created($registration, $request);

        SendEventRegistrationEmailJob::dispatch($request->user(), $event->title);

        return $registration;
    }
}
