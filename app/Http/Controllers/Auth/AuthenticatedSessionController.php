<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request)
    {
        $deviceService = app(\App\Services\Authentication\DeviceService::class);
        $trustedDeviceService = app(\App\Services\Authentication\TrustedDeviceService::class);
        $deviceModel = $trustedDeviceService->getDeviceByRequest($request);

        if ($deviceModel) {
            $token = $deviceService->getDeviceTokenFromCookie($request);
            if ($token === $deviceModel->remember_token && 
                (!$deviceModel->remember_until || \Carbon\Carbon::now()->lessThan($deviceModel->remember_until))) {
                return redirect()->route('dashboard');
            }
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        \App\Models\ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Login Berhasil',
            'description' => 'Berhasil masuk ke dalam sistem',
            'icon' => 'User',
            'color' => 'bg-emerald-500'
        ]);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        if (Auth::check()) {
            \App\Models\ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'Logout',
                'description' => 'Keluar dari sistem',
                'icon' => 'LogOut',
                'color' => 'bg-rose-500'
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
