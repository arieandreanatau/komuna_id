<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationDocument;
use App\Services\AuditLogService;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationDocumentController extends Controller
{
    public function index(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $query = OrganizationDocument::where('organization_id', $organizationId);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $documents = $query->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($documents);
    }

    public function store(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'file' => 'required|file|max:10240',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:legal,financial,certification,other',
        ]);

        $path = FileUploadService::uploadPublic($request->file('file'), 'organization/documents');

        $document = OrganizationDocument::create([
            'organization_id' => $organizationId,
            'name' => $validated['name'],
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

    public function destroy(Request $request, int $organizationId, int $documentId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && ! $org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $document = OrganizationDocument::where('organization_id', $organizationId)
            ->findOrFail($documentId);

        if ($document->file_path) {
            FileUploadService::delete($document->file_path);
        }

        $document->delete();

        AuditLogService::approvalAction('document_deleted', $org, "Deleted document: {$document->name}", $request);

        return $this->successResponse(null, 'Dokumen berhasil dihapus');
    }
}
