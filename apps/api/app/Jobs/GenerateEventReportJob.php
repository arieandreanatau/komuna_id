<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateEventReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly int $eventId,
    ) {}

    public function handle(): array
    {
        $event = Event::findOrFail($this->eventId);

        $totalRegistered = $event->registrations()->where('status', '!=', 'cancelled')->count();
        $totalCheckedIn = $event->registrations()->where('status', 'checked_in')->count();

        return [
            'event_id' => $event->id,
            'title' => $event->title,
            'total_registered' => $totalRegistered,
            'total_checked_in' => $totalCheckedIn,
            'check_in_rate' => $totalRegistered > 0 ? round(($totalCheckedIn / $totalRegistered) * 100, 1) : 0,
            'generated_at' => now()->toISOString(),
        ];
    }
}
