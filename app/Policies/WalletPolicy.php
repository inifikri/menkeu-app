<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Auth\Access\HandlesAuthorization;

class WalletPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can perform top up between wallets.
     */
    public function topUp(User $user, Wallet $targetWallet, Wallet $sourceWallet): bool
    {
        if ($user->role === 'Admin') {
            return true;
        }

        // Suami cannot top up/transfer to/from Istri's wallet, and vice versa
        $targetOwner = $targetWallet->user;
        if ($targetOwner) {
            if ($user->role === 'Suami' && $targetOwner->role === 'Istri') {
                return false;
            }
            if ($user->role === 'Istri' && $targetOwner->role === 'Suami') {
                return false;
            }
        }

        $sourceOwner = $sourceWallet->user;
        if ($sourceOwner) {
            if ($user->role === 'Suami' && $sourceOwner->role === 'Istri') {
                return false;
            }
            if ($user->role === 'Istri' && $sourceOwner->role === 'Suami') {
                return false;
            }
        }

        return true;
    }

    /**
     * Determine if the user can transfer from a wallet to another.
     */
    public function transfer(User $user, Wallet $sourceWallet, Wallet $targetWallet): bool
    {
        if ($user->role === 'Admin') {
            return true;
        }

        // User can only transfer money FROM their own wallets
        if ($sourceWallet->user_id !== $user->id) {
            return false;
        }

        // Additional spouse checks
        $walletOwner = $sourceWallet->user;
        if ($walletOwner) {
            if ($user->role === 'Suami' && $walletOwner->role === 'Istri') {
                return false;
            }
            if ($user->role === 'Istri' && $walletOwner->role === 'Suami') {
                return false;
            }
        }

        return true;
    }

    /**
     * Determine if the user can update a wallet.
     */
    public function update(User $user, Wallet $wallet): bool
    {
        if (in_array($user->role, ['Administrator', 'Admin', 'admin', 'Suami'])) {
            return true;
        }

        // Users can only update their own wallets
        return $wallet->user_id === $user->id;
    }

    /**
     * Determine if the user can delete a wallet.
     */
    public function delete(User $user, Wallet $wallet): bool
    {
        if (in_array($user->role, ['Administrator', 'Admin', 'admin', 'Suami'])) {
            return true;
        }

        // Users can only delete their own wallets
        return $wallet->user_id === $user->id;
    }
}
