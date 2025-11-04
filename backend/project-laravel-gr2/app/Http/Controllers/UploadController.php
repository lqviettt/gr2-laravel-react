<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UploadController extends Controller
{
    /**
     * Upload single image
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadImage(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
                'folder' => 'nullable|string|max:50', // Optional folder name
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation failed', 422, $validator->errors());
            }

            if (!$request->hasFile('image')) {
                return $this->sendError('No image file provided', 400);
            }

            $file = $request->file('image');
            $folder = $request->input('folder', 'uploads'); // Default folder: uploads

            // Generate unique filename
            $filename = $folder . '_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            // Store file
            $path = $file->storeAs('public/' . $folder, $filename);

            if (!$path) {
                return $this->sendError('Failed to save image', 500);
            }

            // Return full URL
            $url = asset('storage/' . $folder . '/' . $filename);

            return $this->sendSuccess([
                'url' => $url,
                'path' => $folder . '/' . $filename,
                'filename' => $filename,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ], 'Image uploaded successfully');

        } catch (\Exception $e) {
            return $this->sendError('Upload failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Upload multiple images
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadImages(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'images' => 'required|array|min:1|max:10', // Max 10 images
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB each
                'folder' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation failed', 422, $validator->errors());
            }

            $files = $request->file('images');
            $folder = $request->input('folder', 'uploads');

            $uploadedImages = [];

            foreach ($files as $file) {
                // Generate unique filename
                $filename = $folder . '_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                // Store file
                $path = $file->storeAs('public/' . $folder, $filename);

                if ($path) {
                    $uploadedImages[] = [
                        'url' => asset('storage/' . $folder . '/' . $filename),
                        'path' => $folder . '/' . $filename,
                        'filename' => $filename,
                        'size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ];
                }
            }

            if (empty($uploadedImages)) {
                return $this->sendError('Failed to upload any images', 500);
            }

            return $this->sendSuccess([
                'images' => $uploadedImages,
                'count' => count($uploadedImages),
            ], 'Images uploaded successfully');

        } catch (\Exception $e) {
            return $this->sendError('Upload failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete uploaded image
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteImage(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'path' => 'required|string', // Path relative to storage/app/public/
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation failed', 422, $validator->errors());
            }

            $path = $request->input('path');

            // Don't allow deleting outside public folder
            if (strpos($path, '..') !== false || strpos($path, '/') === 0) {
                return $this->sendError('Invalid path', 400);
            }

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                return $this->sendSuccess(null, 'Image deleted successfully');
            } else {
                return $this->sendError('Image not found', 404);
            }

        } catch (\Exception $e) {
            return $this->sendError('Delete failed: ' . $e->getMessage(), 500);
        }
    }
}