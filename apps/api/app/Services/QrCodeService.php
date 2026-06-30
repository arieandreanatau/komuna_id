<?php

declare(strict_types=1);

namespace App\Services;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\WriterResult\WriterResult;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    public static function generate(string $data, int $size = 300): ?string
    {
        try {
            $qrCode = QrCode::create($data)
                ->setSize($size)
                ->setMargin(10);

            $writer = new PngWriter();
            $result = $writer->write($qrCode);

            $filename = 'qr/' . md5($data) . '_' . time() . '.png';
            Storage::disk('public')->put($filename, $result->getString());

            return $filename;
        } catch (\Throwable) {
            return null;
        }
    }

    public static function generateDataUri(string $data, int $size = 300): ?string
    {
        try {
            $qrCode = QrCode::create($data)
                ->setSize($size)
                ->setMargin(10);

            $writer = new PngWriter();
            $result = $writer->write($qrCode);

            return 'data:image/png;base64,' . base64_encode($result->getString());
        } catch (\Throwable) {
            return null;
        }
    }

    public static function generateForEvent(int $eventId, int $userId, string $qrCode): ?string
    {
        $data = json_encode([
            'event_id' => $eventId,
            'user_id' => $userId,
            'qr_code' => $qrCode,
            'platform' => 'KomunaID',
        ]);

        return self::generate($data);
    }

    public static function delete(string $path): bool
    {
        return Storage::disk('public')->delete($path);
    }
}
