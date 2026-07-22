<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    protected function isAdmin(User $user): bool
    {
        return in_array($user->role, ['Administrator', 'Admin', 'admin', 'Suami']);
    }

    /**
     * Determine if the user can update the transaction.
     */
    public function update(User $user, Transaction $transaction): bool
    {
        if ($this->isAdmin($user)) {
            return true;
        }

        return $transaction->user_id === $user->id;
    }

    /**
     * Determine if the user can delete the transaction.
     */
    public function delete(User $user, Transaction $transaction): bool
    {
        if ($this->isAdmin($user)) {
            return true;
        }

        return $transaction->user_id === $user->id;
    }
}
