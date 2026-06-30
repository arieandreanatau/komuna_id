<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:jpeg,jpg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,ppt,pptx,zip',
        ]);

        $path = FileUploadService::uploadPublic($request->file('file'), $request->user()->id.'/'.now()->format('Y-m'));
        $url = FileUploadService::getPublicUrl($path);

        return $this->successResponse([
            'path' => $path,
            'url' => $url,
        ], 'File berhasil diupload', 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'path' => 'required|string',
        ]);

        $path = $validated['path'];

        if (str_contains($path, '..') || ! str_starts_with($path, (string) $request->user()->id.'/')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $deleted = FileUploadService::delete($path);

        if (! $deleted) {
            return $this->errorResponse('File tidak ditemukan', 404);
        }

        return $this->successResponse(null, 'File berhasil dihapus');
    }
}
