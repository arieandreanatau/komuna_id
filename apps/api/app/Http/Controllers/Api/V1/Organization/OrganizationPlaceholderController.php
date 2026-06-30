<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationPlaceholderController extends Controller
{
    public function finance(Request $request, int $organizationId): JsonResponse
    {
        return $this->successResponse([], 'Fitur keuangan organisasi akan segera hadir');
    }

    public function marketplace(Request $request, int $organizationId): JsonResponse
    {
        return $this->successResponse([], 'Fitur marketplace organisasi akan segera hadir');
    }

    public function sponsorship(Request $request, int $organizationId): JsonResponse
    {
        return $this->successResponse([], 'Fitur sponsorship organisasi akan segera hadir');
    }

    public function events(Request $request, int $organizationId): JsonResponse
    {
        return $this->successResponse([], 'Fitur event organisasi akan segera hadir');
    }
}
