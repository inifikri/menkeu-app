<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'color' => 'required|string|max:50',
            'budget' => 'required|numeric|min:0',
            'parent_id' => 'nullable|exists:categories,id',
            'priority_level' => 'nullable|integer|between:1,5',
        ];
    }
}
