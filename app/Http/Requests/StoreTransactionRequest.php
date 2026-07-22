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
        $user = $this->user();
        if (in_array($user->role, ['Administrator', 'Admin', 'admin', 'Suami'])) {
            return true;
        }

        $transactions = $this->input('transactions', []);
        foreach ($transactions as $tx) {
            if (isset($tx['user_id']) && (int)$tx['user_id'] !== $user->id) {
                return false;
            }

            if (isset($tx['wallet_id'])) {
                $wallet = \App\Models\Wallet::find($tx['wallet_id']);
                if ($wallet && $wallet->user_id !== null && $wallet->user_id !== $user->id) {
                    return false;
                }
            }
        }

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
