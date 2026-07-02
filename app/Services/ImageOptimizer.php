<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class ImageOptimizer
{
    private const MAX_WIDTH = 1920;

    private const JPEG_QUALITY = 82;

    private const PNG_COMPRESSION = 8;

    public function optimizeAndStore(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');
        $mime = $file->getMimeType();

        if (! in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
            return $path;
        }

        $fullPath = Storage::disk('public')->path($path);

        if (! function_exists('imagecreatefromstring')) {
            return $path;
        }

        $contents = file_get_contents($fullPath);
        if ($contents === false) {
            return $path;
        }

        $image = @imagecreatefromstring($contents);
        if ($image === false) {
            return $path;
        }

        $width = imagesx($image);
        $height = imagesy($image);

        if ($width > self::MAX_WIDTH) {
            $newWidth = self::MAX_WIDTH;
            $newHeight = (int) round($height * ($newWidth / $width));
            $resized = imagecreatetruecolor($newWidth, $newHeight);

            if ($mime === 'image/png') {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
            }

            imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }

        $saved = match ($mime) {
            'image/jpeg' => imagejpeg($image, $fullPath, self::JPEG_QUALITY),
            'image/png' => imagepng($image, $fullPath, self::PNG_COMPRESSION),
            'image/webp' => function_exists('imagewebp') ? imagewebp($image, $fullPath, self::JPEG_QUALITY) : false,
            default => false,
        };

        imagedestroy($image);

        if ($saved === false) {
            throw new RuntimeException('Görsel optimize edilemedi.');
        }

        return $path;
    }
}
