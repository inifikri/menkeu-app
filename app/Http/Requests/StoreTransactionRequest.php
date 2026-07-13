<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
            'transactions' => 'required|array',
            'transactions.*.date' => 'required|date',
            'transactions.*.description' => 'required|string|max:255',
            'transactions.*.amount' => 'required|numeric|min:1',
            'transactions.*.type' => 'required|in:income,expense',
            'transactions.*.category_id' => 'nullable|exists:categories,id',
            'transactions.*.wallet_id' => 'required|exists:wallets,id',
            'transactions.*.user_id' => 'required|exists:users,id',
        ];
    }
}
