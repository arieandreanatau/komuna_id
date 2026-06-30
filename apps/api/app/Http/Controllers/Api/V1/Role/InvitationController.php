<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreInvitationRequest;
use App\Models\Invitation;
use App\Models\Notification;
use App\Models\UserRole;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function store(StoreInvitationRequest $request): JsonResponse
    {
        $invitation = Invitation::create([
            'email' => $request->validated('email'),
            'role_id' => $request->validated('role_id'),
            'invitable_type' => $request->validated('invitable_type'),
            'invitable_id' => $request->validated('invitable_id'),
            'token' => Str::random(60),
            'status' => 'pending',
            'invited_by' => $request->user()->id,
            'expires_at' => now()->addDays(7),
        ]);

        AuditLogService::created($invitation, $request);

        return $this->successResponse($invitation, 'Undangan berhasil dibuat', 201);
    }

    public function accept(Request $request, string $token): JsonResponse
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        if ($invitation->status !== 'pending') {
            return $this->errorResponse('Undangan sudah tidak valid', 422);
        }

        if ($invitation->expires_at->isPast()) {
            return $this->errorResponse('Undangan sudah kedaluwarsa', 422);
        }

        UserRole::create([
            'user_id' => $request->user()->id,
            'role_id' => $invitation->role_id,
            'scope_type' => $invitation->invitable_type,
            'scope_id' => $invitation->invitable_id,
            'is_active' => true,
        ]);

        $invitation->load('role');
        Notification::create([
            'user_id' => $request->user()->id,
            'type' => 'invitation',
            'title' => 'Undangan Diterima',
            'message' => 'Anda telah menerima undangan sebagai '.$invitation->role->name,
            'data' => ['invitation_id' => $invitation->id],
        ]);

        $invitation->update([
            'status' => 'accepted',
            'accepted_by' => $request->user()->id,
        ]);

        AuditLogService::approvalAction('invitation_accepted', $invitation, null, $request);

        return $this->successResponse($invitation, 'Undangan berhasil diterima');
    }

    public function reject(Request $request, string $token): JsonResponse
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        $invitation->update(['status' => 'cancelled']);

        AuditLogService::approvalAction('invitation_rejected', $invitation, null, $request);

        return $this->successResponse($invitation, 'Undangan ditolak');
    }

    public function myInvitations(Request $request): JsonResponse
    {
        $invitations = Invitation::with('role', 'inviter:id,name,email')
            ->where('email', $request->user()->email)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($invitations);
    }
}
