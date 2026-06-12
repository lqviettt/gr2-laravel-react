<?php

namespace App\Repositories;

use App\Contract\ProductVariantRepointerface;
use App\Services\ImageUploadService;
use App\Services\VariantOptionService;
use Illuminate\Database\Eloquent\Model;
use Modules\Product\Models\ProductVariant;

class ProductVariantEloquentRepo extends EloquentRepository implements ProductVariantRepointerface
{
    protected $variantOptionService;
    protected $imageUploadService;

    const VARIANT_IMAGE_PATH = 'variants/';

    /**
     * __construct
     *
     * @param  VariantOptionService $variantOptionService
     * @param  ImageUploadService $imageUploadService
     * @return void
     */
    public function __construct(VariantOptionService $variantOptionService, ImageUploadService $imageUploadService)
    {
        parent::__construct();
        $this->variantOptionService = $variantOptionService;
        $this->imageUploadService = $imageUploadService;
    }

    public function getModel()
    {
        return ProductVariant::class;
    }

    public function builderQuery()
    {
        return $this->_model::query();
    }

    public function createProductVariant(array $data, $productId)
    {
        // Handle base64 image for variant creation
        if (isset($data['image']) && $this->imageUploadService->isBase64Image($data['image'])) {
            try {
                $imagePath = $this->imageUploadService->uploadBase64Image(
                    $data['image'],
                    self::VARIANT_IMAGE_PATH,
                    'variant',
                    $productId
                );
                $data['image'] = $imagePath;
            } catch (\Exception $e) {
                throw new \InvalidArgumentException('Không thể xử lý hình ảnh biến thể: ' . $e->getMessage());
            }
        }

        $variantOption = $this->variantOptionService->findOrFail($data['variant_option_id']);
        $this->variantOptionService->validate($data, $variantOption);

        return $this->create([
            'product_id' => $productId,
            'variant_option_id' => $data['variant_option_id'],
            'value' => $data['value'],
            'quantity' => $data['quantity'],
            'price' => $data['price'],
            'image' => $data['image'] ?? null,
        ]);
    }

    public function updateProductVariant($id, array $data)
    {
        $model = $this->builderQuery()->findOrFail($id);

        // Handle base64 image for variant update
        if (isset($data['image']) && $this->imageUploadService->isBase64Image($data['image'])) {
            try {
                $imagePath = $this->imageUploadService->uploadBase64Image(
                    $data['image'],
                    self::VARIANT_IMAGE_PATH,
                    'variant',
                    $id
                );
                $data['image'] = $imagePath;
            } catch (\Exception $e) {
                throw new \InvalidArgumentException('Không thể xử lý hình ảnh biến thể: ' . $e->getMessage());
            }
        }

        // If variant_option_id is not provided, find or create based on value
        if (!isset($data['variant_option_id']) && isset($data['value'])) {
            $variantOption = $this->variantOptionService->findOrCreate([
                'type' => 'color',
                'name' => $data['value']
            ]);
            $data['variant_option_id'] = $variantOption->id;
        }

        // If color value changed, find or create new variant option
        if (isset($data['value']) && isset($data['variant_option_id'])) {
            $currentVariantOption = $this->variantOptionService->findOrFail($data['variant_option_id']);
            if ($data['value'] !== $currentVariantOption->name) {
                $variantOption = $this->variantOptionService->findOrCreate([
                    'type' => 'color',
                    'name' => $data['value']
                ]);
                $data['variant_option_id'] = $variantOption->id;
            }
        }

        $variantOption = $this->variantOptionService->findOrFail($data['variant_option_id']);
        $this->variantOptionService->validate($data, $variantOption);

        return $this->update($model, $data);
    }

    public function find(Model $model)
    {
        return $model->load('product');
    }
}
