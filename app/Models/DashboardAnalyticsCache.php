<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardAnalyticsCache extends Model
{
    protected $table = 'dashboard_analytics_cache';

    protected $fillable = [
        'key',
        'data'
    ];

    protected $casts = [
        'data' => 'array'
    ];
}
