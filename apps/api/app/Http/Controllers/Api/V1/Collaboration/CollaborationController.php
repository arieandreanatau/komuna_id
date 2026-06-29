<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Collaboration;

use App\Enums\CollaborationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Collaboration\CollaborationStoreRequest;
use App\Http\Requests\Collaboration\CollaborationUpdateRequest;
use App\Models\Collaboration;
use App\Models\CollaborationDeliverable;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollaborationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Collaboration::with(['sender', 'receiver']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $collabs = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($collabs);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $collab = Collaboration::with(['sender', 'receiver', 'deliverables'])->findOrFail($id);
        return $this->successResponse($collab);
    }

    public function store(CollaborationStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $collab = Collaboration::create([
            ...$validated,
            'slug' => Str::slug($validated['title']),
            'status' => CollaborationStatus::INQUIRY,
        ]);

        AuditLogService::created($collab, $request);

        return $this->successResponse($collab, 'Kolaborasi berhasil dibuat', 201);
    }

    public function update(CollaborationUpdateRequest $request, int $id): JsonResponse
    {
        $collab = Collaboration::findOrFail($id);

        if ($collab->sender_id !== $request->user()->id && $collab->receiver_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validated();

        $oldValues = $collab->only(array_keys($validated));
        $collab->update($validated);

        AuditLogService::updated($collab, $oldValues, $request);

        return $this->successResponse($collab->fresh(), 'Kolaborasi berhasil diperbarui');
    }

    public function accept(Request $request, int $id): JsonResponse
    {
        $collab = Collaboration::findOrFail($id);

        if ($collab->sender_id !== $request->user()->id && $collab->receiver_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $collab->update(['status' => CollaborationStatus::NEGOTIATION]);
        AuditLogService::approvalAction('accepted', $collab, null, $request);
        return $this->successResponse($collab, 'Kolaborasi diterima');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $collab = Collaboration::findOrFail($id);

        if ($collab->sender_id !== $request->user()->id && $collab->receiver_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $collab->update(['status' => CollaborationStatus::REJECTED]);
        AuditLogService::approvalAction('rejected', $collab, null, $request);
        return $this->successResponse($collab, 'Kolaborasi ditolak');
    }

    public function requestRevision(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['notes' => 'required|string|max:1000']);
        $collab = Collaboration::findOrFail($id);

        if ($collab->sender_id !== $request->user()->id && $collab->receiver_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $collab->update(['status' => CollaborationStatus::PROPOSAL]);
        AuditLogService::approvalAction('revision_requested', $collab, $validated['notes'], $request);
        return $this->successResponse($collab, 'Revisi diminta');
    }

    public function start(Request $request, int $id): JsonResponse
    {
        $collab = Collaboration::findOrFail($id);

        if ($collab->sender_id !== $request->user()->id && $collab->receiver_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $collab->update(['status' => CollaborationStatus::ACTIVE]);
        AuditLogService::approvalAction('started', $collab, null, $request);
        return $this->successResponse($collab, 'Kolaborasi dimulai');
    }

    public function complete(Request $request, int $id): JsonResponse
    {
        $collab = Collaboration::findOrFail($id);

        if ($collab->sender_id !== $request->user()->id && $collab->receiver_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $collab->update(['status' => CollaborationStatus::COMPLETED]);
        AuditLogService::approvalAction('completed', $collab, null, $request);
        return $this->successResponse($collab, 'Kolaborasi selesai');
    }

    public function archive(Request $request, int $id): JsonResponse
    {
        $collab = Collaboration::findOrFail($id);
        $collab->update(['status' => CollaborationStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $collab, null, $request);
        return $this->successResponse($collab, 'Kolaborasi diarsipkan');
    }

    public function deliverables(Request $request, int $id): JsonResponse
    {
        $deliverables = CollaborationDeliverable::where('collaboration_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
        return $this->successResponse($deliverables);
    }

    public function storeDeliverable(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'due_date' => 'nullable|date',
        ]);

        $deliverable = CollaborationDeliverable::create([
            ...$validated,
            'collaboration_id' => $id,
            'status' => 'pending',
        ]);

        AuditLogService::created($deliverable, $request);

        return $this->successResponse($deliverable, 'Deliverable berhasil dibuat', 201);
    }
}
