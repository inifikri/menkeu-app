<?php

namespace App\Events;

use App\Models\TrustedDevice;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;

class DeviceRegistered
{
    use SerializesModels;

    public TrustedDevice $device;
    public Request $request;

    public function __construct(TrustedDevice $device, Request $request)
    {
        $this->device = $device;
        $this->request = $request;
    }
}
