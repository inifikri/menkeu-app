<?php

namespace App\Events;

use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;

class DeviceRemoved
{
    use SerializesModels;

    public int $userId;
    public string $deviceName;
    public Request $request;

    public function __construct(int $userId, string $deviceName, Request $request)
    {
        $this->userId = $userId;
        $this->deviceName = $deviceName;
        $this->request = $request;
    }
}
