<?php

namespace App\Repositories;

use App\Models\UserPin;

class PinRepository
{
    public function findByUserId(int $userId): ?UserPin
    {
        return UserPin::where('user_id', $userId)->first();
    }

    public function createOrUpdate(int $userId, string $pinHash): UserPin
    {
        return UserPin::updateOrCreate(
            ['user_id' => $userId],
            ['pin_hash' => $pinHash]
        );
    }

    public function deleteForUser(int $userId): bool
    {
        return (bool) UserPin::where('user_id', $userId)->delete();
    }
}
