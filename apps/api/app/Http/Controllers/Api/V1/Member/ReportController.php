<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reportable_type' => 'required|string|in:user,community,event,article',
            'reportable_id' => 'required|integer',
            'reason' => 'required|string|max:100',
            'description' => 'nullable|string|max:2000',
        ]);

        $report = Report::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        AuditLogService::created($report, $request);

        return $this->successResponse($report, 'Laporan berhasil dikirim', 201);
    }

    public function index(Request $request): JsonResponse
    {
        $reports = Report::where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($reports);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $report = Report::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return $this->successResponse($report);
    }
}
