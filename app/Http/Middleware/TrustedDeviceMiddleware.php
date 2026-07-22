<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\Authentication\TrustedDeviceService;
use App\Services\Authentication\DeviceService;
use Symfony\Component\HttpFoundation\Response;

class TrustedDeviceMiddleware
{
    protected TrustedDeviceService $trustedDeviceService;
    protected DeviceService $deviceService;

    public function __construct(
        TrustedDeviceService $trustedDeviceService,
        DeviceService $deviceService
    ) {
        $this->trustedDeviceService = $trustedDeviceService;
        $this->deviceService = $deviceService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        if (app()->runningUnitTests() && !$request->headers->has('X-Test-Authentication-Enhancement')) {
            return $next($request);
        }

        // Only apply to authenticated web users
        if (Auth::check()) {
            $user = Auth::user();
            
            // Skip for registration and logout routes
            $excludedRoutes = [
                'device.register',
                'device.register.store',
                'logout',
                'pin.create',
                'pin.store'
            ];

            if ($request->routeIs($excludedRoutes)) {
                return $next($request);
            }

            // Check if device is trusted
            if (!$this->trustedDeviceService->isDeviceTrusted($request, $user->id)) {
                if ($request->session()->get('password_authenticated')) {
                    return redirect()->route('device.register');
                }

                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                $this->deviceService->clearDeviceCookies();

                return redirect()->route('login')->with('status', 'Device unregistered or session expired. Please login again with email and password.');
            }
        }

        return $next($request);
    }
}
