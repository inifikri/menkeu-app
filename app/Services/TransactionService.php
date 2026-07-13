<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Wallet;
use App\Services\DashboardAnalyticsService;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    protected $analyticsService;

    public function __construct(DashboardAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Store bulk transactions and update wallet balances.
     */
    public function storeBulkTransactions(array $transactionsData): void
    {
        DB::transaction(function () use ($transactionsData) {
            // Eager load wallets involved to prevent N+1 query problem
            $walletIds = collect($transactionsData)->pluck('wallet_id')->unique()->toArray();
            $wallets = Wallet::whereIn('id', $walletIds)->get()->keyBy('id');

            foreach ($transactionsData as $tx) {
                Transaction::create($tx);

                $wallet = $wallets->get($tx['wallet_id']);
                if ($wallet) {
                    if ($tx['type'] === 'income') {
                        $wallet->balance += $tx['amount'];
                    } else {
                        $wallet->balance -= $tx['amount'];
                    }
                    $wallet->save();
                }
            }
        });

        // Trigger analytics recalculation
        $this->analyticsService->calculateAndCache();
    }

    /**
     * Update a single transaction and adjust wallet balances accordingly.
     */
    public function updateTransaction(Transaction $transaction, array $data): void
    {
        DB::transaction(function () use ($transaction, $data) {
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

            // Update transaction data
            $transaction->update($data);

            // Apply new wallet balance
            $newWallet = Wallet::find($data['wallet_id']);
            if ($newWallet) {
                if ($data['type'] === 'income') {
                    $newWallet->balance += $data['amount'];
                } else {
                    $newWallet->balance -= $data['amount'];
                }
                $newWallet->save();
            }
        });

        // Trigger analytics recalculation
        $this->analyticsService->calculateAndCache();
    }

    /**
     * Delete a transaction and revert its effect on the wallet balance.
     */
    public function deleteTransaction(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
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
        });

        // Trigger analytics recalculation
        $this->analyticsService->calculateAndCache();
    }
}
