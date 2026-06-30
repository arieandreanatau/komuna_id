<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\FileUploadService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateFileUpload
{
    public function handle(Request $request, Closure $next, string $field, string $type = 'image'): Response
    {
        if (! $request->hasFile($field)) {
            return $next($request);
        }

        $file = $request->file($field);

        $rules = match ($type) {
            'image' => [
                'mimes' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                'max_size' => 2048,
            ],
            'document' => [
                'mimes' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
                'max_size' => 5120,
            ],
            'avatar' => [
                'mimes' => ['jpg', 'jpeg', 'png', 'webp'],
                'max_size' => 1024,
            ],
            default => [
                'mimes' => ['jpg', 'jpeg', 'png', 'pdf'],
                'max_size' => 2048,
            ],
        };

        if (! FileUploadService::validateMime($file, $rules['mimes'])) {
            return response()->json([
                'success' => false,
                'message' => 'Format file tidak valid',
                'data' => null,
                'errors' => ['file' => ['Format yang diizinkan: '.implode(', ', $rules['mimes'])]],
                'meta' => null,
            ], 422);
        }

        if (! FileUploadService::validateSize($file, $rules['max_size'])) {
            return response()->json([
                'success' => false,
                'message' => 'Ukuran file terlalu besar',
                'data' => null,
                'errors' => ['file' => ['Ukuran maksimal: '.$rules['max_size'].'KB']],
                'meta' => null,
            ], 422);
        }

        return $next($request);
    }
}
