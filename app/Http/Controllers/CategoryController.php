<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'color' => 'required|string|max:50',
            'budget' => 'required|numeric|min:0',
        ]);

        Category::create($validated);

        return redirect()->back()->with('message', 'Kategori berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->back()->with('message', 'Kategori berhasil dihapus.');
    }
}
