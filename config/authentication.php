<?php

return [
    'pin_length' => 6,
    'pin_max_attempt' => 5,
    'pin_lock_minutes' => 15,
    'trusted_days' => (int) env('TRUSTED_DEVICE_EXPIRED', 30),
];
