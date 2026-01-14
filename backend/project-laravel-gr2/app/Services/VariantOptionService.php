<?php

namespace App\Services;

use Modules\Product\Models\VariantOption;
use InvalidArgumentException;

class VariantOptionService
{
    /**
     * findOrFail
     *
     * @param  mixed $id
     * @return VariantOption
     */
    public function findOrFail(int $id): VariantOption
    {
        return VariantOption::findOrFail($id);
    }

    /**
     * findOrCreate
     *
     * @param  array $data
     * @return VariantOption
     */
    public function findOrCreate(array $data): VariantOption
    {
        return VariantOption::firstOrCreate(
            ['type' => $data['type'], 'name' => $data['name']],
            $data
        );
    }

    /**
     * validate
     *
     * @param  mixed $data
     * @param  mixed $variantOption
     * @return void
     */
    public function validate(array $data, VariantOption $variantOption): void
    {
        // Implement validation logic here
    }
}
