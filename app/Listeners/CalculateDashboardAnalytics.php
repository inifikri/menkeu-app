<?php

namespace App\Listeners;

use App\Events\BulkTransactionsSaved;
use App\Services\DashboardAnalyticsService;

class CalculateDashboardAnalytics
{
    protected $analyticsService;

    public function __construct(DashboardAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function handle(BulkTransactionsSaved $event): void
    {
        $this->analyticsService->calculateAndCache();
    }
}
