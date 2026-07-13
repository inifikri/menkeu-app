<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferWalletRequest extends FormRequest
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
            'source_wallet_id' => 'required|exists:wallets,id',
            'target_wallet_id' => 'required|exists:wallets,id',
            'amount' => 'required|numeric|min:1',
        ];
    }
}
