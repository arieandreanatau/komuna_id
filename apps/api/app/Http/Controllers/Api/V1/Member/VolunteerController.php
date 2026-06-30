<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Models\VolunteerOpportunity;
use App\Models\VolunteerApplication;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = VolunteerOpportunity::with(['community', 'organizer'])
            ->where('status', 'open');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        $opportunities = $query->latest()->paginate($request->get('per_page', 15));
        return $this->paginatedResponse($opportunities);
    }

    public function show(int $id): JsonResponse
    {
        $opportunity = VolunteerOpportunity::with(['community', 'organizer'])->findOrFail($id);
        return $this->successResponse($opportunity);
    }

    public function apply(Request $request, int $id): JsonResponse
    {
        $opportunity = VolunteerOpportunity::findOrFail($id);

        if ($opportunity->status !== 'open') {
            return $this->errorResponse('Lowongan sudah ditutup', 422);
        }

        $existing = VolunteerApplication::where('opportunity_id', $id)
            ->where('user_id', $request->user()->id)
            ->where('status', '!=', 'rejected')
            ->exists();

        if ($existing) {
            return $this->errorResponse('Sudah mengajukan', 422);
        }

        $application = VolunteerApplication::create([
            'opportunity_id' => $id,
            'user_id' => $request->user()->id,
            'message' => $request->input('message'),
            'status' => 'pending',
        ]);

        AuditLogService::created($application, $request);

        return $this->successResponse($application, 'Pengajuan volunteer terkirim', 201);
    }

    public function myApplications(Request $request): JsonResponse
    {
        $applications = VolunteerApplication::with('opportunity')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($applications);
    }
}
