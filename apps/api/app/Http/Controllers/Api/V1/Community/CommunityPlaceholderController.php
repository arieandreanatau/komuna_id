<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityPlaceholderController extends Controller
{
    public function subCommunities(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur sub-komunitas akan segera hadir');
    }

    public function regions(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur regional akan segera hadir');
    }

    public function discussions(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur diskusi komunitas akan segera hadir');
    }

    public function volunteers(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur volunteer komunitas akan segera hadir');
    }

    public function collaborations(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur kolaborasi komunitas akan segera hadir');
    }

    public function finance(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur keuangan komunitas akan segera hadir');
    }

    public function marketplace(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur marketplace komunitas akan segera hadir');
    }

    public function media(Request $request, int $communityId): JsonResponse
    {
        return $this->successResponse([], 'Fitur media komunitas akan segera hadir');
    }
}
