<?php

namespace App\Services\Authentication;

use App\Repositories\PinRepository;
use Illuminate\Support\Facades\Hash;

class PinService
{
    protected PinRepository $pinRepository;

    public function __construct(PinRepository $pinRepository)
    {
        $this->pinRepository = $pinRepository;
    }

    public function hasPin(int $userId): bool
    {
        return $this->pinRepository->findByUserId($userId) !== null;
    }

    public function registerPin(int $userId, string $pin): bool
    {
        if (!preg_match('/^\d{6}$/', $pin)) {
            return false;
        }

        $hashed = Hash::make($pin);
        $this->pinRepository->createOrUpdate($userId, $hashed);
        return true;
    }

    public function verifyPin(int $userId, string $pin): bool
    {
        $pinRecord = $this->pinRepository->findByUserId($userId);
        if (!$pinRecord) {
            return false;
        }

        return Hash::check($pin, $pinRecord->pin_hash);
    }
}
