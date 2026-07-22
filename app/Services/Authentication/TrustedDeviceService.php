<?php

namespace App\Services\Authentication;

use App\Repositories\TrustedDeviceRepository;
use App\Models\TrustedDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TrustedDeviceService
{
    protected TrustedDeviceRepository $deviceRepository;
    protected DeviceService $deviceService;

    public function __construct(
        TrustedDeviceRepository $deviceRepository,
        DeviceService $deviceService
    ) {
        $this->deviceRepository = $deviceRepository;
        $this->deviceService = $deviceService;
    }

    public function getDeviceByRequest(Request $request): ?TrustedDevice
    {
        $uuid = $this->deviceService->getDeviceUuidFromCookie($request);
        if (!$uuid) {
            return null;
        }

        return $this->deviceRepository->findByUuid($uuid);
    }

    public function isDeviceTrusted(Request $request, int $userId): bool
    {
        $uuid = $this->deviceService->getDeviceUuidFromCookie($request);
        $token = $this->deviceService->getDeviceTokenFromCookie($request);

        if (!$uuid || !$token) {
            return false;
        }

        $device = $this->deviceRepository->findForUser($userId, $uuid);

        if (!$device) {
            return false;
        }

        // Check if token matches
        if ($device->remember_token !== $token) {
            return false;
        }

        // Check expiration
        if ($device->remember_until && Carbon::now()->greaterThan($device->remember_until)) {
            return false;
        }

        return true;
    }

    public function registerDevice(Request $request, int $userId, string $deviceName): TrustedDevice
    {
        $uuid = (string) Str::uuid();
        $token = Str::random(60);

        $userAgent = $request->header('User-Agent') ?? '';
        $browser = $this->deviceService->detectBrowser($userAgent);
        $platform = $this->deviceService->detectPlatform($userAgent);
        $ipAddress = $request->ip();

        $days = (int) config('authentication.trusted_days', 30);
        $rememberUntil = Carbon::now()->addDays($days);

        $device = $this->deviceRepository->create([
            'user_id' => $userId,
            'device_uuid' => $uuid,
            'device_name' => $deviceName,
            'browser' => $browser,
            'platform' => $platform,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'remember_token' => $token,
            'remember_until' => $rememberUntil,
            'trusted_at' => Carbon::now(),
            'last_login' => Carbon::now(),
        ]);

        $this->deviceService->setDeviceCookies($uuid, $token, $days);

        return $device;
    }

    public function checkLockout(TrustedDevice $device): bool
    {
        if ($device->locked_until && Carbon::now()->lessThan($device->locked_until)) {
            return true;
        }

        // If lockout time passed, reset failed attempts
        if ($device->locked_until && Carbon::now()->greaterThanOrEqualTo($device->locked_until)) {
            $device->update([
                'failed_attempt' => 0,
                'locked_until' => null,
            ]);
        }

        return false;
    }

    public function handleFailedAttempt(TrustedDevice $device): void
    {
        $maxAttempts = (int) config('authentication.pin_max_attempt', 5);
        $lockMinutes = (int) config('authentication.pin_lock_minutes', 15);

        $attempts = $device->failed_attempt + 1;
        $updateData = ['failed_attempt' => $attempts];

        if ($attempts >= $maxAttempts) {
            $updateData['locked_until'] = Carbon::now()->addMinutes($lockMinutes);
        }

        $device->update($updateData);
    }

    public function resetFailedAttempts(TrustedDevice $device): void
    {
        $device->update([
            'failed_attempt' => 0,
            'locked_until' => null,
        ]);
    }

    public function removeDevice(int $userId, int $deviceId): bool
    {
        return $this->deviceRepository->deleteForUser($userId, $deviceId);
    }

    public function removeAllDevices(int $userId, ?int $exceptId = null): int
    {
        return $this->deviceRepository->deleteAllForUser($userId, $exceptId);
    }

    public function getDevicesForUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return $this->deviceRepository->getAllForUser($userId);
    }
}
