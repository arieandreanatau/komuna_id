<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandAuditLogController extends Controller
{
    public function index(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $query = AuditLog::with('user:id,name,email')
            ->where(function ($q) use ($brandId) {
                $q->where('auditable_type', 'App\\Models\\Brand')
                  ->where('auditable_id', $brandId)
                  ->orWhere(function ($q2) use ($brandId) {
                      $q2->where('auditable_type', 'App\\Models\\BrandMember')
                         ->where('new_values->brand_id', $brandId);
                  })
                  ->orWhere(function ($q2) use ($brandId) {
                      $q2->where('auditable_type', 'App\\Models\\Campaign')
                         ->where('new_values->brand_id', $brandId);
                  });
            });

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $logs = $query->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($logs);
    }
}
