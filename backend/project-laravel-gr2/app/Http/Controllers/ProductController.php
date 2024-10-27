<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $categoryId = $request->input('category_id');
        $status = $request->input('status');
        $perPage = $request->input('per_page', 10);

        $product = Product::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', $search . '%')
                        ->orWhere('code', 'like', $search . '%');
                });
            })
            ->when($categoryId, function ($query) use ($categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->with('category:id,name')
            ->select('id', 'name', 'code', 'category_id', 'image', 'description', 'price', 'status',)
            ->paginate($perPage);


        return response()->json($product->makeHidden(['created_at', 'updated_at']));
    }

    public function store(ProductRequest $request)
    {
        $validateData = $request->validated();

        // if ($request->hasFile('image')) {
        //     $imagePath = $request->file('image')->store('products', 'public');
        //     $validatedData['image'] = $imagePath;
        // }

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
