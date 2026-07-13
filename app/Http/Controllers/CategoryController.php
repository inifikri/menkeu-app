<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Store a newly created category.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $this->categoryService->createCategory($request->validated());

        return redirect()->back()->with('message', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateCategoryRequest $request, int $id): RedirectResponse
    {
        $category = Category::findOrFail($id);

        $this->categoryService->updateCategory($category, $request->validated());

        return redirect()->back()->with('message', 'Kategori berhasil diperbarui.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(int $id): RedirectResponse
    {
        $category = Category::findOrFail($id);

        $this->categoryService->deleteCategory($category);

        return redirect()->back()->with('message', 'Kategori berhasil dihapus.');
    }
}
