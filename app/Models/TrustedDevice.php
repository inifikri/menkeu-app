<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrustedDevice extends Model
{
    protected $fillable = [
        'user_id',
        'device_uuid',
        'device_name',
        'browser',
        'platform',
        'ip_address',
        'user_agent',
        'remember_token',
        'remember_until',
        'trusted_at',
        'last_login',
        'failed_attempt',
        'locked_until',
    ];

    protected $casts = [
        'remember_until' => 'datetime',
        'trusted_at' => 'datetime',
        'last_login' => 'datetime',
        'locked_until' => 'datetime',
        'failed_attempt' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
