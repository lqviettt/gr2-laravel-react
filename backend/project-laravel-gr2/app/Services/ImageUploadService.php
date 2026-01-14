<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    /**
     * Upload base64 image
     *
     * @param string $base64Image Base64 encoded image string
     * @param string $folder Folder name (e.g., 'products', 'variants')
     * @param string $prefix Filename prefix (e.g., 'product', 'variant')
     * @param int|null $id Optional ID for filename generation
     * @return string Relative path to saved image
     * @throws \InvalidArgumentException
     */
    public function uploadBase64Image(string $base64Image, string $folder = 'uploads', string $prefix = 'image', ?int $id = null): string
    {
        // Validate base64 format
        if (!str_starts_with($base64Image, 'data:image/')) {
            throw new \InvalidArgumentException('Invalid base64 image format');
        }

        try {
            // Decode base64 image
            $imageData = explode(',', $base64Image);
            $image = base64_decode($imageData[1]);

            if (!$image) {
                throw new \InvalidArgumentException('Failed to decode base64 image');
            }

            // Get image extension from base64 string
            preg_match('/data:image\/(\w+);base64/', $base64Image, $matches);
            $extension = $matches[1] ?? 'png';

            // Validate extension
            $allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
            if (!in_array(strtolower($extension), $allowedExtensions)) {
                throw new \InvalidArgumentException('Unsupported image format: ' . $extension);
            }

            // Generate unique filename
            $filename = $prefix . '_' . ($id ? $id . '_' : '') . time() . '_' . Str::random(8) . '.' . $extension;

            // Save image to storage
            $path = $folder . '/' . $filename;
            $saved = Storage::disk('public')->put($path, $image);

            if (!$saved) {
                throw new \InvalidArgumentException('Failed to save image to storage');
            }

            return $path;

        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Image upload failed: ' . $e->getMessage());
        }
    }

    /**
     * Delete image from storage
     *
     * @param string $path Relative path to image
     * @return bool
     */
    public function deleteImage(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }

    /**
     * Get full URL for image
     *
     * @param string|null $path Relative path to image
     * @return string|null Full URL or null if no path
     */
    public function getImageUrl(?string $path): ?string
    {
        return $path ? asset('storage/' . $path) : null;
    }

    /**
     * Check if string is base64 image
     *
     * @param string $string
     * @return bool
     */
    public function isBase64Image(string $string): bool
    {
        return str_starts_with($string, 'data:image/');
    }
}