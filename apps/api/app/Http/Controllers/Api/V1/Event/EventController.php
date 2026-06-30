<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Event;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\EventStoreRequest;
use App\Http\Requests\Event\EventUpdateRequest;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::with(['community', 'organizer'])
            ->where('status', EventStatus::PUBLISHED);

        if ($request->has('community_id')) {
            $query->where('community_id', $request->community_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('upcoming')) {
            $query->where('start_date', '>', now());
        }

        $events = $query->orderBy('start_date', 'asc')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($events);
    }

    public function show(string $slug): JsonResponse
    {
        $event = Event::with(['community', 'organizer', 'tickets'])
            ->where('slug', $slug)
            ->firstOrFail();

        return $this->successResponse(new \App\Http\Resources\EventResource($event));
    }

    public function store(EventStoreRequest $request, int $communityId): JsonResponse
    {
        $action = new \App\Actions\CreateEventAction();
        $event = $action->execute($request->validated(), $communityId, $request);

        return $this->successResponse($event, 'Event berhasil dibuat', 201);
    }

    public function update(EventUpdateRequest $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $this->authorize('update', $event);

        $validated = $request->validated();

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $oldValues = $event->only(array_keys($validated));
        $event->update($validated);

        AuditLogService::updated($event, $oldValues, $request);

        return $this->successResponse($event->fresh(), 'Event berhasil diperbarui');
    }

    public function publish(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $this->authorize('publish', $event);

        if ($event->status !== EventStatus::DRAFT) {
            return $this->errorResponse('Hanya event draft yang bisa dipublikasikan', 422);
        }

        $event->update(['status' => EventStatus::PUBLISHED]);
        AuditLogService::approvalAction('published', $event, null, $request);

        return $this->successResponse($event, 'Event berhasil dipublikasikan');
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $this->authorize('update', $event);

        $event->update(['status' => EventStatus::CANCELLED]);
        AuditLogService::approvalAction('cancelled', $event, null, $request);

        return $this->successResponse($event, 'Event berhasil dibatalkan');
    }

    public function archive(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $this->authorize('update', $event);

        $event->update(['status' => EventStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $event, null, $request);

        return $this->successResponse($event, 'Event berhasil diarsipkan');
    }

    public function register(Request $request, int $id): JsonResponse
    {
        $action = new \App\Actions\RegisterEventAction();
        $registration = $action->execute($id, $request);

        return $this->successResponse($registration, 'Berhasil terdaftar di event', 201);
    }

    public function myTickets(Request $request): JsonResponse
    {
        $tickets = EventRegistration::with(['event', 'ticket'])
            ->where('user_id', $request->user()->id)
            ->orderBy('registered_at', 'desc')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($tickets);
    }

    public function myEvents(Request $request): JsonResponse
    {
        $events = Event::with(['community'])
            ->where('organizer_id', $request->user()->id)
            ->orWhereHas('registrations', fn($q) => $q->where('user_id', $request->user()->id)->where('status', '!=', 'cancelled'))
            ->paginate(min((int) $request->get('per_page', 15), 50));
        return $this->paginatedResponse($events);
    }

    public function ticket(Request $request, int $id): JsonResponse
    {
        $registration = EventRegistration::with(['event', 'ticket'])
            ->where('event_id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
        return $this->successResponse(['registration' => $registration, 'qr_code' => $registration->qr_code]);
    }

    public function cancelRegistration(Request $request, int $id): JsonResponse
    {
        $registration = EventRegistration::where('event_id', $id)
            ->where('user_id', $request->user()->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if (! $registration) {
            return $this->errorResponse('Pendaftaran tidak ditemukan', 404);
        }

        $registration->update(['status' => 'cancelled']);

        Event::where('id', $id)->decrement('current_participants');

        AuditLogService::approvalAction('cancelled_registration', $registration, null, $request);

        return $this->successResponse(null, 'Pendaftaran event berhasil dibatalkan');
    }

    public function checkIn(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $this->authorize('checkIn', $event);

        $validated = $request->validate([
            'qr_code' => 'required|string',
        ]);

        $registration = EventRegistration::where('event_id', $id)
            ->where('qr_code', $validated['qr_code'])
            ->where('status', 'registered')
            ->first();

        if (! $registration) {
            return $this->errorResponse('QR code tidak valid atau sudah check-in', 422);
        }

        $registration->update([
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        AuditLogService::approvalAction('checked_in', $registration, null, $request);

        return $this->successResponse($registration, 'Check-in berhasil');
    }

    public function report(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        if ($event->organizer_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $totalRegistered = EventRegistration::where('event_id', $id)
            ->where('status', '!=', 'cancelled')
            ->count();

        $totalCheckedIn = EventRegistration::where('event_id', $id)
            ->where('status', 'checked_in')
            ->count();

        return $this->successResponse([
            'event' => $event->only(['id', 'title', 'slug', 'start_date', 'end_date', 'max_participants', 'current_participants']),
            'stats' => [
                'total_registered' => $totalRegistered,
                'total_checked_in' => $totalCheckedIn,
                'check_in_rate' => $totalRegistered > 0 ? round(($totalCheckedIn / $totalRegistered) * 100, 1) : 0,
            ],
        ]);
    }
}
