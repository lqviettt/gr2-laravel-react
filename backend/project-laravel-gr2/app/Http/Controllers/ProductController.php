<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $product = Product::all();

        return response()->json($product->makeHidden(['created_at', 'updated_at']));
    }

    public function store(ProductRequest $request)
    {
        $validateData = $request->validated();
        $product = Product::create($validateData);

        return response()->json($product);
    }

    public function show(Product $product)
    {
        $product = $product->load('category');

        return response()->json($product);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $validateData = $request->validated();
        $product->update($validateData);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product = $product->delete();

        return response()->json($product);
    }
}
