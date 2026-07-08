<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'transactions' => 'required|array',
            'transactions.*.date' => 'required|date',
            'transactions.*.description' => 'required|string|max:255',
            'transactions.*.amount' => 'required|numeric|min:1',
            'transactions.*.type' => 'required|in:income,expense',
            'transactions.*.category_id' => 'nullable|exists:categories,id',
            'transactions.*.wallet_id' => 'required|exists:wallets,id',
            'transactions.*.user_id' => 'required|exists:users,id',
        ]);

        foreach ($validated['transactions'] as $tx) {
            Transaction::create($tx);

            // Update Wallet Balance
            $wallet = Wallet::find($tx['wallet_id']);
            if ($tx['type'] === 'income') {
                $wallet->balance += $tx['amount'];
            } else {
                $wallet->balance -= $tx['amount'];
            }
            $wallet->save();
        }

        event(new \App\Events\BulkTransactionsSaved());

        return redirect()->back()->with('message', 'Transaksi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'type' => 'required|in:income,expense',
            'category_id' => 'nullable|exists:categories,id',
            'wallet_id' => 'required|exists:wallets,id',
            'user_id' => 'required|exists:users,id',
        ]);

        // Revert old wallet balance
        $oldWallet = Wallet::find($transaction->wallet_id);
        if ($oldWallet) {
            if ($transaction->type === 'income') {
                $oldWallet->balance -= $transaction->amount;
            } else {
                $oldWallet->balance += $transaction->amount;
            }
            $oldWallet->save();
        }

        $transaction->update($validated);

        // Apply new wallet balance
        $newWallet = Wallet::find($validated['wallet_id']);
        if ($newWallet) {
            if ($validated['type'] === 'income') {
                $newWallet->balance += $validated['amount'];
            } else {
                $newWallet->balance -= $validated['amount'];
            }
            $newWallet->save();
        }

        return redirect()->back()->with('message', 'Transaksi berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        
        // Revert wallet balance
        $wallet = Wallet::find($transaction->wallet_id);
        if ($wallet) {
            if ($transaction->type === 'income') {
                $wallet->balance -= $transaction->amount;
            } else {
                $wallet->balance += $transaction->amount;
            }
            $wallet->save();
        }

        $transaction->delete();

        return redirect()->back()->with('message', 'Transaksi berhasil dihapus.');
    }
}
