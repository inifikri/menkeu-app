<?php

namespace App\Repositories;

use App\Models\TrustedDevice;
use Illuminate\Database\Eloquent\Collection;

class TrustedDeviceRepository
{
    public function findByUuid(string $uuid): ?TrustedDevice
    {
        return TrustedDevice::where('device_uuid', $uuid)->first();
    }

    public function findForUser(int $userId, string $uuid): ?TrustedDevice
    {
        return TrustedDevice::where('user_id', $userId)
            ->where('device_uuid', $uuid)
            ->first();
    }

    public function create(array $data): TrustedDevice
    {
        return TrustedDevice::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $device = TrustedDevice::find($id);
        if ($device) {
            return $device->update($data);
        }
        return false;
    }

    public function delete(int $id): bool
    {
        $device = TrustedDevice::find($id);
        if ($device) {
            return (bool) $device->delete();
        }
        return false;
    }

    public function deleteForUser(int $userId, int $deviceId): bool
    {
        $device = TrustedDevice::where('user_id', $userId)->where('id', $deviceId)->first();
        if ($device) {
            return (bool) $device->delete();
        }
        return false;
    }

    public function deleteAllForUser(int $userId, ?int $exceptId = null): int
    {
        $query = TrustedDevice::where('user_id', $userId);
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        return $query->delete();
    }

    public function getAllForUser(int $userId): Collection
    {
        return TrustedDevice::where('user_id', $userId)
            ->orderBy('last_login', 'desc')
            ->get();
    }
}
