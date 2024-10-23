<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $category = Category::all();

        return response()->json($category->makeHidden(['created_at', 'updated_at']));
    }

    public function store(CategoryRequest $request)
    {
        $validateData = $request->validated();
        $category = Category::create($validateData);

        return response()->json($category);
    }

    public function show(Category $category)
    {
        $category = $category->load('products');

        return response()->json($category);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $validateData = $request->validated();
        $category->update($validateData);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category = $category->delete();

        return response()->json($category);
    }
}
