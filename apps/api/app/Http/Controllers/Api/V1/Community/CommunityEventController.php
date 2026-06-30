<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CommunityEventController extends Controller
{
    public function index(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $query = Event::with(['organizer:id,full_name,username'])
            ->where('community_id', $communityId);

        if (! $request->user()->canManageCommunityEvents($communityId)) {
            $query->where('status', EventStatus::PUBLISHED);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $events = $query->orderBy('start_date', 'desc')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($events);
    }

    public function store(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('createEvent', $community);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image' => 'nullable|string|max:500',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'location_url' => 'nullable|string|max:500',
            'is_online' => 'boolean',
            'online_url' => 'nullable|string|max:500',
            'max_participants' => 'nullable|integer|min:1',
            'ticket_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
        ]);

        $event = Event::create([
            ...$validated,
            'slug' => Str::slug($validated['title']),
            'community_id' => $communityId,
            'organizer_id' => $request->user()->id,
            'status' => EventStatus::DRAFT,
            'currency' => $validated['currency'] ?? 'IDR',
            'ticket_price' => $validated['ticket_price'] ?? 0,
        ]);

        AuditLogService::created($event, $request);

        return $this->successResponse($event->load('organizer:id,full_name,username'), 'Event berhasil dibuat', 201);
    }

    public function show(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::with(['organizer:id,full_name,username', 'tickets'])
            ->where('community_id', $communityId)
            ->where('id', $eventId)
            ->firstOrFail();

        return $this->successResponse($event);
    }

    public function update(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $community = Community::findOrFail($communityId);
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('update', $event);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'cover_image' => 'nullable|string|max:500',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'location_url' => 'nullable|string|max:500',
            'is_online' => 'boolean',
            'online_url' => 'nullable|string|max:500',
            'max_participants' => 'nullable|integer|min:1',
            'ticket_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $oldValues = $event->only(array_keys($validated));
        $event->update($validated);

        AuditLogService::updated($event, $oldValues, $request);

        return $this->successResponse($event->fresh(), 'Event berhasil diperbarui');
    }

    public function publish(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('publish', $event);

        if ($event->status !== EventStatus::DRAFT) {
            return $this->errorResponse('Hanya event draft yang bisa dipublikasikan', 422);
        }

        $event->update(['status' => EventStatus::PUBLISHED]);
        AuditLogService::approvalAction('published', $event, null, $request);

        return $this->successResponse($event, 'Event berhasil dipublikasikan');
    }

    public function cancel(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('update', $event);

        $event->update(['status' => EventStatus::CANCELLED]);
        AuditLogService::approvalAction('cancelled', $event, null, $request);

        return $this->successResponse($event, 'Event berhasil dibatalkan');
    }

    public function archive(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('update', $event);

        $event->update(['status' => EventStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $event, null, $request);

        return $this->successResponse($event, 'Event berhasil diarsipkan');
    }

    public function participants(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('manageParticipants', $event);

        $participants = EventRegistration::with(['user:id,full_name,username,email', 'ticket'])
            ->where('event_id', $eventId);

        if ($request->has('status')) {
            $participants->where('status', $request->status);
        }

        $participants = $participants->latest('registered_at')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($participants);
    }

    public function approveParticipant(Request $request, int $communityId, int $eventId, int $participantId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('manageParticipants', $event);

        $registration = EventRegistration::where('event_id', $eventId)
            ->where('id', $participantId)
            ->where('status', 'pending')
            ->firstOrFail();

        $registration->update(['status' => 'registered']);

        AuditLogService::approvalAction('participant_approved', $registration, null, $request);

        return $this->successResponse(null, 'Peserta berhasil disetujui');
    }

    public function rejectParticipant(Request $request, int $communityId, int $eventId, int $participantId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('manageParticipants', $event);

        $registration = EventRegistration::where('event_id', $eventId)
            ->where('id', $participantId)
            ->where('status', 'pending')
            ->firstOrFail();

        $registration->update(['status' => 'cancelled']);

        AuditLogService::approvalAction('participant_rejected', $registration, null, $request);

        return $this->successResponse(null, 'Peserta ditolak');
    }

    public function checkin(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('checkIn', $event);

        $validated = $request->validate([
            'qr_code' => 'required_without:user_id|string',
            'user_id' => 'required_without:qr_code|integer|exists:users,id',
            'notes' => 'nullable|string|max:500',
        ]);

        if (isset($validated['qr_code'])) {
            $registration = EventRegistration::where('event_id', $eventId)
                ->where('qr_code', $validated['qr_code'])
                ->where('status', 'registered')
                ->first();
        } else {
            $registration = EventRegistration::where('event_id', $eventId)
                ->where('user_id', $validated['user_id'])
                ->where('status', 'registered')
                ->first();
        }

        if (! $registration) {
            return $this->errorResponse('Peserta tidak ditemukan atau sudah check-in', 422);
        }

        $registration->update([
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        AuditLogService::approvalAction('checked_in', $registration, $validated['notes'] ?? null, $request);

        return $this->successResponse($registration, 'Check-in berhasil');
    }

    public function checkins(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('manageParticipants', $event);

        $checkins = EventRegistration::with(['user:id,full_name,username,email'])
            ->where('event_id', $eventId)
            ->where('status', 'checked_in')
            ->latest('checked_in_at')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($checkins);
    }

    public function report(Request $request, int $communityId, int $eventId): JsonResponse
    {
        $event = Event::where('community_id', $communityId)->where('id', $eventId)->firstOrFail();

        $this->authorize('manageParticipants', $event);

        $totalRegistered = EventRegistration::where('event_id', $eventId)
            ->where('status', '!=', 'cancelled')
            ->count();

        $totalCheckedIn = EventRegistration::where('event_id', $eventId)
            ->where('status', 'checked_in')
            ->count();

        $statusBreakdown = EventRegistration::where('event_id', $eventId)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return $this->successResponse([
            'event' => $event->only(['id', 'title', 'slug', 'start_date', 'end_date', 'max_participants', 'current_participants', 'status']),
            'stats' => [
                'total_registered' => $totalRegistered,
                'total_checked_in' => $totalCheckedIn,
                'check_in_rate' => $totalRegistered > 0 ? round(($totalCheckedIn / $totalRegistered) * 100, 1) : 0,
                'status_breakdown' => $statusBreakdown,
            ],
        ]);
    }
}
