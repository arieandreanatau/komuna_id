<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandPlaceholderController extends Controller
{
    public function finance(Request $request, int $brandId): JsonResponse
    {
        return $this->successResponse([], 'Fitur keuangan brand akan segera hadir');
    }

    public function marketplace(Request $request, int $brandId): JsonResponse
    {
        return $this->successResponse([], 'Fitur marketplace brand akan segera hadir');
    }

    public function sponsorship(Request $request, int $brandId): JsonResponse
    {
        return $this->successResponse([], 'Fitur sponsorship brand akan segera hadir');
    }

    public function events(Request $request, int $brandId): JsonResponse
    {
        return $this->successResponse([], 'Fitur event brand akan segera hadir');
    }
}
