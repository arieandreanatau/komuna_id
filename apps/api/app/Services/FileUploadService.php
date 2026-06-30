<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public static function validateMime(UploadedFile $file, array $allowedMimes): bool
    {
        $extension = strtolower($file->getClientOriginalExtension());

        return in_array($extension, $allowedMimes);
    }

    public static function validateSize(UploadedFile $file, int $maxSizeKB): bool
    {
        return $file->getSize() <= ($maxSizeKB * 1024);
    }

    public static function uploadPublic(UploadedFile $file, string $directory = 'public'): string
    {
        return $file->store($directory, 'public');
    }

    public static function uploadPrivate(UploadedFile $file, string $directory = 'private'): string
    {
        return $file->store($directory, 'private');
    }

    public static function delete(string $path, string $disk = 'public'): bool
    {
        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }

    public static function getTemporaryUrl(string $path, int $expirationMinutes = 60): string
    {
        return Storage::disk('private')->temporaryUrl($path, now()->addMinutes($expirationMinutes));
    }

    public static function getPublicUrl(string $path): string
    {
        return Storage::disk('public')->url($path);
    }

    public static function sanitizeFilename(string $filename): string
    {
        $filename = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $filename);
        $filename = preg_replace('/_+/', '_', $filename);

        return $filename;
    }

    public static function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();

        return uniqid().'_'.time().'.'.$extension;
    }
}
