<?php

namespace App\Events;

use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;

class PinChanged
{
    use SerializesModels;

    public int $userId;
    public Request $request;

    public function __construct(int $userId, Request $request)
    {
        $this->userId = $userId;
        $this->request = $request;
    }
}
