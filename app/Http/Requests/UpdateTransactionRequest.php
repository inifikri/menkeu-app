<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
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

        if ($this->has('user_id') && (int)$this->input('user_id') !== $user->id) {
            return false;
        }

        if ($this->has('wallet_id')) {
            $wallet = \App\Models\Wallet::find($this->input('wallet_id'));
            if ($wallet && $wallet->user_id !== null && $wallet->user_id !== $user->id) {
                return false;
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
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'type' => 'required|in:income,expense',
            'category_id' => 'nullable|exists:categories,id',
            'wallet_id' => 'required|exists:wallets,id',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
