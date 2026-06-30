<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandDocument;
use App\Services\AuditLogService;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandDocumentController extends Controller
{
    public function index(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $query = BrandDocument::where('brand_id', $brandId);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $documents = $query->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($documents);
    }

    public function store(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $request->validate([
            'file' => 'required|file|max:10240',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:brand_asset,legal,financial,certification,other',
        ]);

        $path = FileUploadService::uploadPublic($request->file('file'), 'brand/documents');

        $document = BrandDocument::create([
            'brand_id' => $brandId,
            'name' => $request->input('name'),
            'type' => $request->type,
            'file_path' => $path,
            'mime_type' => $request->file('file')->getMimeType(),
            'file_size' => $request->file('file')->getSize(),
            'uploaded_by' => $request->user()->id,
            'status' => 'active',
        ]);

        AuditLogService::created($document, $request);

        return $this->successResponse($document, 'Dokumen berhasil diunggah', 201);
    }

    public function destroy(Request $request, int $brandId, int $documentId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $document = BrandDocument::where('brand_id', $brandId)
            ->findOrFail($documentId);

        if ($document->file_path) {
            FileUploadService::delete($document->file_path);
        }

        $document->delete();

        AuditLogService::approvalAction('document_deleted', $brand, "Deleted document: {$document->name}", $request);

        return $this->successResponse(null, 'Dokumen berhasil dihapus');
    }
}
