<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $category = Category::query()
            ->when($search, function ($query) use ($search) {
                return $query->where('name', 'like', '%' . $search . '%');
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', 'like', '%' . $status . '%');
            })
            ->select('id', 'name', 'status')
            ->paginate(10);

        // return response()->json($category->makeHidden(['created_at', 'updated_at']));
        return view('category.index')->with('category', $category);
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
