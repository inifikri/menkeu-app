<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can manage other users.
     */
    public function manage(User $user): bool
    {
        return in_array($user->role, ['Administrator', 'Admin', 'admin', 'Suami']);
    }
}
