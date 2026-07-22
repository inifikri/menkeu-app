<?php

namespace App\Services\Authentication;

use App\Models\SecurityLog;
use Illuminate\Http\Request;

class SecurityLogService
{
    protected DeviceService $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    public function log(?int $userId, string $action, Request $request): SecurityLog
    {
        $userAgent = $request->header('User-Agent') ?? '';
        $browser = $this->deviceService->detectBrowser($userAgent);
        $platform = $this->deviceService->detectPlatform($userAgent);
        $ipAddress = $request->ip();

        return SecurityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $ipAddress,
            'browser' => "$browser ($platform)",
            'user_agent' => $userAgent,
        ]);
    }
}
