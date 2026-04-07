<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DocumentCategoryController extends Controller
{
    public function index()
    {
        return response()->json(DocumentCategory::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $data['slug'] = Str::slug($data['name']);
        $category = DocumentCategory::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, DocumentCategory $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);
        $data['slug'] = Str::slug($data['name']);
        $category->update($data);
        return response()->json($category);
    }

    public function destroy(DocumentCategory $category)
    {
        $category->delete();
        return response()->json(['status' => 'ok']);
    }
}
