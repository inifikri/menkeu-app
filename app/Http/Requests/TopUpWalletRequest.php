<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TopUpWalletRequest extends FormRequest
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
            'wallet_id' => 'required|exists:wallets,id',
            'source_wallet_id' => 'required|exists:wallets,id',
            'amount' => 'required|numeric|min:1',
        ];
    }
}
