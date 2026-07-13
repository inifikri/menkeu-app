<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\Transaction;
use App\Services\DashboardAnalyticsService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class WalletService
{
    protected $analyticsService;

    public function __construct(DashboardAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Store a new wallet.
     */
    public function createWallet(array $data, int $userId): Wallet
    {
        return DB::transaction(function () use ($data, $userId) {
            $isUtama = (bool) ($data['is_utama'] ?? false);

            if ($isUtama) {
                // Set all other wallets of this user to is_utama = false
                Wallet::where('user_id', $userId)->update(['is_utama' => false]);
            }

            return Wallet::create(array_merge($data, [
                'user_id' => $userId,
                'balance' => 0,
                'is_utama' => $isUtama
            ]));
        });
    }

    /**
     * Update an existing wallet.
     */
    public function updateWallet(Wallet $wallet, array $data, int $userId): Wallet
    {
        return DB::transaction(function () use ($wallet, $data, $userId) {
            $isUtama = (bool) ($data['is_utama'] ?? $wallet->is_utama);

            if ($isUtama) {
                // Set all other wallets of this user to is_utama = false
                Wallet::where('user_id', $userId)->where('id', '!=', $wallet->id)->update(['is_utama' => false]);
            }

            $wallet->update(array_merge($data, ['is_utama' => $isUtama]));
            return $wallet;
        });
    }

    /**
     * Delete a wallet, transferring any remaining balance back to Dompet Utama.
     *
     * @throws ValidationException
     */
    public function deleteWallet(Wallet $wallet, int $userId): void
    {
        if ($wallet->is_utama) {
            throw ValidationException::withMessages([
                'error' => 'Dompet Utama tidak dapat dihapus.'
            ]);
        }

        // Authorize via WalletPolicy
        Gate::authorize('delete', $wallet);

        DB::transaction(function () use ($wallet, $userId) {
            $dompetUtama = Wallet::where('user_id', $userId)
                ->where('is_utama', true)
                ->first();

            if ($dompetUtama && $wallet->balance > 0) {
                $balanceToReturn = (float) $wallet->balance;

                // Return balance to Dompet Utama
                $dompetUtama->balance += $balanceToReturn;
                $dompetUtama->save();

                // Zero out balance before delete
                $wallet->balance = 0;
                $wallet->save();

                // Create transaction record on Dompet Utama
                Transaction::create([
                    'date' => now()->format('Y-m-d'),
                    'description' => 'Pengembalian saldo dari hapus kantong: ' . $wallet->name,
                    'amount' => $balanceToReturn,
                    'type' => 'income',
                    'category_id' => null,
                    'wallet_id' => $dompetUtama->id,
                    'user_id' => $userId,
                ]);
            }

            $wallet->delete();
        });
    }

    /**
     * Execute top up logic.
     *
     * @throws ValidationException
     */
    public function topUpWallet(Wallet $targetWallet, Wallet $sourceWallet, float $amount, $user): void
    {
        // Authorize via WalletPolicy
        Gate::authorize('topUp', [$targetWallet, $sourceWallet]);

        // Direct top up to Dompet Utama
        if ($sourceWallet->id === $targetWallet->id) {
            if (!$targetWallet->is_utama) {
                throw ValidationException::withMessages(['amount' => 'Tidak bisa melakukan top up ke diri sendiri untuk kantong cabang.']);
            }

            DB::transaction(function () use ($targetWallet, $amount, $user) {
                $targetWallet->balance += $amount;
                $targetWallet->save();

                Transaction::create([
                    'date' => now()->format('Y-m-d'),
                    'description' => 'Top Up Mandiri Dompet Utama: ' . $targetWallet->name,
                    'amount' => $amount,
                    'type' => 'income',
                    'category_id' => null,
                    'wallet_id' => $targetWallet->id,
                    'user_id' => $user->id,
                ]);
            });

            return;
        }

        // Transfer funds between different wallets
        DB::transaction(function () use ($sourceWallet, $targetWallet, $amount, $user) {
            $sourceWallet->balance -= $amount;
            $sourceWallet->save();

            $targetWallet->balance += $amount;
            $targetWallet->save();

            // Create transactions
            Transaction::create([
                'date' => now()->format('Y-m-d'),
                'description' => 'Top Up Kantong: ' . $targetWallet->name,
                'amount' => $amount,
                'type' => 'expense',
                'category_id' => null,
                'wallet_id' => $sourceWallet->id,
                'user_id' => $user->id,
            ]);

            Transaction::create([
                'date' => now()->format('Y-m-d'),
                'description' => 'Top Up dari ' . $sourceWallet->name,
                'amount' => $amount,
                'type' => 'income',
                'category_id' => null,
                'wallet_id' => $targetWallet->id,
                'user_id' => $user->id,
            ]);
        });
    }

    /**
     * Execute wallet transfer logic.
     *
     * @throws ValidationException
     */
    public function transferWallet(Wallet $sourceWallet, Wallet $targetWallet, float $amount, $user): void
    {
        // Validasi: Nominal pemindahan dari Dompet Utama tidak boleh melebihi saldonya
        if ($sourceWallet->is_utama && $sourceWallet->balance < $amount) {
            throw ValidationException::withMessages(['amount' => 'Saldo Dompet Utama tidak mencukupi untuk dipindahkan.']);
        }

        // Pengalihan: Jika target wallet milik user lain, alihkan agar masuk ke Dompet Utama milik user tersebut
        if ($targetWallet->user_id !== $sourceWallet->user_id) {
            $targetUserUtama = Wallet::where('user_id', $targetWallet->user_id)
                ->where('is_utama', true)
                ->first();
            if ($targetUserUtama) {
                $targetWallet = $targetUserUtama;
            }
        }

        if ($sourceWallet->id === $targetWallet->id) {
            throw ValidationException::withMessages(['amount' => 'Tidak bisa mentransfer uang ke kantong yang sama.']);
        }

        // Authorize via WalletPolicy
        Gate::authorize('transfer', [$sourceWallet, $targetWallet]);

        DB::transaction(function () use ($sourceWallet, $targetWallet, $amount, $user) {
            $sourceWallet->balance -= $amount;
            $sourceWallet->save();

            $targetWallet->balance += $amount;
            $targetWallet->save();

            $sourceOwnerName = $sourceWallet->user->name ?? 'Global';
            $targetOwnerName = $targetWallet->user->name ?? 'Global';

            // Create transactions
            Transaction::create([
                'date' => now()->format('Y-m-d'),
                'description' => 'Transfer ke ' . $targetWallet->name . ' (' . $targetOwnerName . ')',
                'amount' => $amount,
                'type' => 'expense',
                'category_id' => null,
                'wallet_id' => $sourceWallet->id,
                'user_id' => $sourceWallet->user_id ?? $user->id,
            ]);

            Transaction::create([
                'date' => now()->format('Y-m-d'),
                'description' => 'Terima Transfer dari ' . $sourceWallet->name . ' (' . $sourceOwnerName . ')',
                'amount' => $amount,
                'type' => 'income',
                'category_id' => null,
                'wallet_id' => $targetWallet->id,
                'user_id' => $targetWallet->user_id ?? $user->id,
            ]);
        });
    }
}
