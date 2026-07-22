<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Display the dashboard.
     */
    public function index(Request $request): InertiaResponse
    {
        $user = auth()->user();

        // Ensure user has a primary wallet (Dompet Utama)
        $this->dashboardService->ensureUserHasPrimaryWallet($user);

        // Fetch dashboard data
        $dashboardData = $this->dashboardService->getDashboardData(
            auth()->id(),
            $request->session()->getId()
        );

        $trustedDevice = null;
        if (!$user) {
            $deviceService = app(\App\Services\Authentication\DeviceService::class);
            $trustedDeviceService = app(\App\Services\Authentication\TrustedDeviceService::class);
            $deviceModel = $trustedDeviceService->getDeviceByRequest($request);
            if ($deviceModel) {
                $token = $deviceService->getDeviceTokenFromCookie($request);
                if ($token === $deviceModel->remember_token && 
                    (!$deviceModel->remember_until || \Carbon\Carbon::now()->lessThan($deviceModel->remember_until))) {
                    $trustedDevice = [
                        'id' => $deviceModel->id,
                        'device_name' => $deviceModel->device_name,
                        'user_email' => $deviceModel->user->email,
                        'user_name' => $deviceModel->user->name,
                    ];
                }
            }
        }
        $dashboardData['trustedDevice'] = $trustedDevice;

        return Inertia::render('Dashboard', $dashboardData);
    }

    /**
     * Get dashboard metrics.
     */
    public function metrics(Request $request): \Illuminate\Http\JsonResponse
    {
        $force = $request->query('force_recalculate') === 'true';
        $metrics = $this->dashboardService->getMetrics($force);

        return response()->json([
            'status' => 'success',
            'message' => 'Dashboard metrics retrieved successfully.',
            'code' => 200,
            'data' => $metrics
        ], 200);
    }
}

