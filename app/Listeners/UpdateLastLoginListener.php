<?php

namespace App\Listeners;

use App\Events\LoginUsingPIN;
use App\Services\Authentication\TrustedDeviceService;
use Carbon\Carbon;

class UpdateLastLoginListener
{
    protected TrustedDeviceService $deviceService;

    public function __construct(TrustedDeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    public function handle(LoginUsingPIN $event): void
    {
        $device = $this->deviceService->getDeviceByRequest($event->request);
        if ($device && $device->user_id === $event->user->id) {
            $device->update([
                'last_login' => Carbon::now(),
            ]);
        }
    }
}
