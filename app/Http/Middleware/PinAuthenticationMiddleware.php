<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\Authentication\TrustedDeviceService;
use App\Services\Authentication\DeviceService;
use Symfony\Component\HttpFoundation\Response;

class PinAuthenticationMiddleware
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

        if (Auth::check()) {
            $user = Auth::user();
            
            $excludedRoutes = [
                'device.register',
                'device.register.store',
                'logout',
                'pin.login',
                'pin.create',
                'pin.store'
            ];

            if ($request->routeIs($excludedRoutes)) {
                return $next($request);
            }

            $device = $this->trustedDeviceService->getDeviceByRequest($request);
            
            if (!$device || $device->user_id !== $user->id || !$this->trustedDeviceService->isDeviceTrusted($request, $user->id)) {
                if ($request->session()->get('password_authenticated')) {
                    return $next($request);
                }

                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                $this->deviceService->clearDeviceCookies();
                
                return redirect()->route('login')->with('status', 'Device unregistered or session expired. Please login again with email and password.');
            }

            if ($this->trustedDeviceService->checkLockout($device)) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('login')->withErrors(['pin' => 'PIN login is temporarily locked. Please login with your email and password.']);
            }
        }

        return $next($request);
    }
}
