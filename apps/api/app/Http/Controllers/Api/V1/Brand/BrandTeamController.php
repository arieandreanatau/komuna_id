<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandMember;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandTeamController extends Controller
{
    public function index(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && ! $brand->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $query = BrandMember::with('user:id,name,email,status')
            ->where('brand_id', $brandId);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $members = $query->latest('created_at')
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($members);
    }

    public function show(Request $request, int $brandId, int $memberId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && ! $brand->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = BrandMember::with('user:id,name,email,status')
            ->where('brand_id', $brandId)
            ->where('id', $memberId)
            ->firstOrFail();

        return $this->successResponse($member);
    }

    public function remove(Request $request, int $brandId, int $memberId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && ! $brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $member = BrandMember::where('brand_id', $brandId)
            ->where('id', $memberId)
            ->firstOrFail();

        if ($member->user_id === $brand->owner_id) {
            return $this->errorResponse('Owner brand tidak bisa dihapus', 422);
        }

        if ($member->role === 'admin' && $brand->owner_id !== $request->user()->id) {
            return $this->errorResponse('Hanya owner yang bisa menghapus admin', 422);
        }

        $userId = $member->user_id;
        $member->delete();

        AuditLogService::approvalAction('member_removed', $brand, "Removed user ID: {$userId}", $request);

        return $this->successResponse(null, 'Anggota berhasil dihapus dari brand');
    }
}
