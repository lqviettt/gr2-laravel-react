<?php

namespace Modules\Product\Http\Controllers;

use App\Contract\ProductRepositoryInterface;
use App\Contract\ProductVariantRepointerface;
use App\Contract\VariantRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Product\Models\Product;

class ProductController extends Controller
{
    /**
     * __construct
     *
     * @param  mixed $productRepository
     * @param  mixed $variantRepository
     * @param  mixed $productVariantRepository
     * @param  ImageUploadService $imageUploadService
     * @return void
     */
    public function __construct(
        protected ProductRepositoryInterface $productRepository,
        protected VariantRepositoryInterface $variantRepository,
        protected ProductVariantRepointerface $productVariantRepository,
        protected ImageUploadService $imageUploadService
    ) {}

    /**
     * index
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('perPage', 2);
        $query = $this->productRepository
            ->builderQuery()
            ->searchByNameCode($request->search)
            ->searchByCategory($request->category_id)
            ->searchByStatus($request->status)
            ->whereCategoryActive();

        $result = $query->paginate($perPage);
        $result->getCollection()->load('variants.variantOption');
        
        return $this->sendSuccess($result);
    }

    /**
     * store
     *
     * @param  ProductRequest $request
     * @return JsonResponse
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $validateData = $request->validated();

        // Handle base64 image for product creation
        if (isset($validateData['image']) && $this->imageUploadService->isBase64Image($validateData['image'])) {
            try {
                $imagePath = $this->imageUploadService->uploadBase64Image(
                    $validateData['image'],
                    'products',
                    'product'
                );
                $validateData['image'] = $imagePath;
            } catch (\Exception $e) {
                return $this->sendError('Không thể xử lý hình ảnh: ' . $e->getMessage(), 400);
            }
        }

        $product = $this->productRepository->create($validateData);

        // Handle variant creation if color is provided
        if (!empty($validateData['color'])) {
            // Find or create variant option for color
            $variantOption = $this->variantRepository->builderQuery()
                ->where('type', 'color')
                ->where('name', $validateData['color'])
                ->first();

            if (!$variantOption) {
                $variantOption = $this->variantRepository->create([
                    'type' => 'color',
                    'name' => $validateData['color']
                ]);
            }

            // Create product variant
            $this->productVariantRepository->createProductVariant([
                'variant_option_id' => $variantOption->id,
                'value' => $validateData['color'], // Use color as value
                'quantity' => $validateData['quantity'] ?? 0,
                'price' => $validateData['price'] ?? 0,
                'image' => null,
            ], $product->id);
        }

        return $this->created($product);
    }

    /**
     * show
     *
     * @return JsonResponse
     */
    public function show(Product $product): JsonResponse
    {
        $product = $this->productRepository->find($product);

        return $this->sendSuccess($product);
    }

    /**
     * update
     *
     * @param  ProductRequest $request
     * @param  Product $product
     * @return JsonResponse
     */
    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $validateData = $request->validated();

        // Handle base64 image for product update
        if (isset($validateData['image']) && $this->imageUploadService->isBase64Image($validateData['image'])) {
            try {
                $imagePath = $this->imageUploadService->uploadBase64Image(
                    $validateData['image'],
                    'products',
                    'product',
                    $product->id
                );
                $validateData['image'] = $imagePath;
            } catch (\Exception $e) {
                return $this->sendError('Không thể xử lý hình ảnh: ' . $e->getMessage(), 400);
            }
        }

        // Extract color before updating product (don't pass to product update)
        $color = $validateData['color'] ?? null;
        unset($validateData['color']);

        $product = $this->productRepository->update($product, $validateData);

        // Handle variant update if color is provided
        if (!empty($color)) {
            // Find or create variant option for color
            $variantOption = $this->variantRepository->builderQuery()
                ->where('type', 'color')
                ->where('name', $color)
                ->first();

            if (!$variantOption) {
                $variantOption = $this->variantRepository->create([
                    'type' => 'color',
                    'name' => $color
                ]);
            }

            // Find existing product variant or create new one
            $existingVariant = $this->productVariantRepository->builderQuery()
                ->where('product_id', $product->id)
                ->first();

            if ($existingVariant) {
                // Update existing variant
                $this->productVariantRepository->updateProductVariant($existingVariant->id, [
                    'variant_option_id' => $variantOption->id,
                    'value' => $color,
                    'quantity' => $validateData['quantity'] ?? $existingVariant->quantity,
                    'price' => $validateData['price'] ?? $existingVariant->price,
                    'image' => $existingVariant->image,
                ]);
            } else {
                // Create new variant
                $this->productVariantRepository->createProductVariant([
                    'variant_option_id' => $variantOption->id,
                    'value' => $color,
                    'quantity' => $validateData['quantity'] ?? 0,
                    'price' => $validateData['price'] ?? 0,
                    'image' => null,
                ], $product->id);
            }
        }

        return $this->updated($product);
    }

    /**
     * destroy
     *
     * @param  mixed $product
     * @return JsonResponse
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete($product);

        return $this->deteled();
    }
}
