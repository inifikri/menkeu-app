<?php

namespace App\Listeners;

use App\Events\DeviceRegistered;
use App\Events\PinCreated;
use App\Events\PinChanged;
use App\Events\DeviceRemoved;
use App\Events\LoginUsingPIN;
use App\Services\Authentication\SecurityLogService;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;

class SecurityLogListener
{
    protected SecurityLogService $logService;

    public function __construct(SecurityLogService $logService)
    {
        $this->logService = $logService;
    }

    public function handle(object $event): void
    {
        if ($event instanceof DeviceRegistered) {
            $this->logService->log(
                $event->device->user_id,
                'New Device',
                $event->request
            );
        } elseif ($event instanceof PinCreated) {
            $this->logService->log(
                $event->userId,
                'Reset PIN',
                $event->request
            );
        } elseif ($event instanceof PinChanged) {
            $this->logService->log(
                $event->userId,
                'Reset PIN',
                $event->request
            );
        } elseif ($event instanceof DeviceRemoved) {
            $this->logService->log(
                $event->userId,
                'Device Removed',
                $event->request
            );
        } elseif ($event instanceof LoginUsingPIN) {
            $this->logService->log(
                $event->user->id,
                'Login PIN',
                $event->request
            );
        } elseif ($event instanceof Login) {
            $request = request();
            if (!$request->has('pin')) {
                $this->logService->log(
                    $event->user->id,
                    'Login Password',
                    $request
                );
                session(['password_authenticated' => true]);
            }
        } elseif ($event instanceof Logout) {
            if ($event->user) {
                $this->logService->log(
                    $event->user->id,
                    'Logout',
                    request()
                );
            }
        } elseif ($event instanceof Failed) {
            $request = request();
            if (!$request->has('pin')) {
                $this->logService->log(
                    $event->user ? $event->user->id : null,
                    'Failed Password',
                    $request
                );
            }
        }
    }
}
