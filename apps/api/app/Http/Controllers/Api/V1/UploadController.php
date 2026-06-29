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
            'file' => 'required|file|max:10240',
        ]);

        $path = FileUploadService::uploadPublic($request->file('file'));
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

        $deleted = FileUploadService::delete($validated['path']);

        if (! $deleted) {
            return $this->errorResponse('File tidak ditemukan', 404);
        }

        return $this->successResponse(null, 'File berhasil dihapus');
    }
}
