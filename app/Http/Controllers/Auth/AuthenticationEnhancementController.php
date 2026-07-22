<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Events\DeviceRegistered;
use App\Events\PinCreated;
use App\Events\PinChanged;
use App\Events\DeviceRemoved;
use App\Events\LoginUsingPIN;
use App\Services\Authentication\DeviceService;
use App\Services\Authentication\PinService;
use App\Services\Authentication\TrustedDeviceService;
use App\Services\Authentication\SecurityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthenticationEnhancementController extends Controller
{
    protected DeviceService $deviceService;
    protected PinService $pinService;
    protected TrustedDeviceService $trustedDeviceService;
    protected SecurityLogService $securityLogService;

    public function __construct(
        DeviceService $deviceService,
        PinService $pinService,
        TrustedDeviceService $trustedDeviceService,
        SecurityLogService $securityLogService
    ) {
        $this->deviceService = $deviceService;
        $this->pinService = $pinService;
        $this->trustedDeviceService = $trustedDeviceService;
        $this->securityLogService = $securityLogService;
    }

    public function showRegisterDevice(Request $request)
    {
        $user = Auth::user();
        if ($this->trustedDeviceService->isDeviceTrusted($request, $user->id)) {
            return redirect()->intended(route('dashboard'));
        }

        $userAgent = $request->header('User-Agent') ?? '';
        $browser = $this->deviceService->detectBrowser($userAgent);
        $platform = $this->deviceService->detectPlatform($userAgent);
        $defaultName = "$browser on $platform";

        return Inertia::render('Auth/DeviceRegister', [
            'hasPin' => $this->pinService->hasPin($user->id),
            'defaultDeviceName' => $defaultName,
        ]);
    }

    public function storeRegisterDevice(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $hasPin = $this->pinService->hasPin($user->id);

        $rules = [
            'device_name' => 'required|string|max:255',
        ];

        if (!$hasPin) {
            $rules['pin'] = 'required|numeric|digits:6';
        }

        $request->validate($rules);

        if (!$hasPin) {
            $this->pinService->registerPin($user->id, $request->pin);
            event(new PinCreated($user->id, $request));
        }

        $device = $this->trustedDeviceService->registerDevice($request, $user->id, $request->device_name);
        
        event(new DeviceRegistered($device, $request));

        return redirect()->intended(route('dashboard'));
    }

    public function pinLogin(Request $request): RedirectResponse
    {
        $device = $this->trustedDeviceService->getDeviceByRequest($request);

        if (!$device) {
            return redirect()->route('login')->withErrors(['pin' => 'Device not recognized. Please login with password.']);
        }

        if ($this->trustedDeviceService->checkLockout($device)) {
            $remaining = Carbon::now()->diffInSeconds($device->locked_until);
            $minutes = ceil($remaining / 60);
            return redirect()->route('login')->withErrors([
                'pin' => "PIN login is locked. Try again in $minutes minutes, or login with email/password."
            ]);
        }

        $request->validate([
            'pin' => 'required|numeric|digits:6',
        ]);

        $user = $device->user;

        if ($this->pinService->verifyPin($user->id, $request->pin)) {
            Auth::login($user, true);
            $request->session()->regenerate();
            $this->trustedDeviceService->resetFailedAttempts($device);

            event(new LoginUsingPIN($user, $request));

            // Create system log
            \App\Models\ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'Login PIN Berhasil',
                'description' => "Masuk menggunakan PIN pada device: {$device->device_name}",
                'icon' => 'Shield',
                'color' => 'bg-emerald-500'
            ]);

            return redirect()->intended(route('dashboard'));
        }

        // Failed attempt
        $this->trustedDeviceService->handleFailedAttempt($device);
        $this->securityLogService->log($user->id, 'Failed PIN', $request);

        // System activity log for failed attempt
        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'Login PIN Gagal',
            'description' => "Gagal masuk menggunakan PIN pada device: {$device->device_name}",
            'icon' => 'ShieldAlert',
            'color' => 'bg-rose-500'
        ]);

        throw ValidationException::withMessages([
            'pin' => ['PIN yang dimasukkan salah.'],
        ]);
    }

    public function pinCreate(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        $request->validate([
            'pin' => 'required|numeric|digits:6',
        ]);

        $this->pinService->registerPin($user->id, $request->pin);
        event(new PinCreated($user->id, $request));

        return back()->with('status', 'PIN created successfully.');
    }

    public function pinReset(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // Must re-authenticate with password
        $request->validate([
            'password' => 'required|current_password',
            'pin' => 'required|numeric|digits:6',
        ]);

        $this->pinService->registerPin($user->id, $request->pin);
        event(new PinChanged($user->id, $request));

        return back()->with('status', 'PIN reset successfully.');
    }

    public function indexDevices(Request $request)
    {
        $user = Auth::user();
        $devices = $this->trustedDeviceService->getDevicesForUser($user->id);
        $currentDevice = $this->trustedDeviceService->getDeviceByRequest($request);

        return response()->json([
            'devices' => $devices->map(function ($d) use ($currentDevice) {
                return [
                    'id' => $d->id,
                    'device_uuid' => $d->device_uuid,
                    'device_name' => $d->device_name,
                    'browser' => $d->browser,
                    'platform' => $d->platform,
                    'ip_address' => $d->ip_address,
                    'last_login' => $d->last_login ? $d->last_login->toIso8601String() : null,
                    'created_at' => $d->created_at->toIso8601String(),
                    'is_current' => $currentDevice && $currentDevice->id === $d->id,
                ];
            }),
        ]);
    }

    public function destroyDevice(Request $request, $id): RedirectResponse
    {
        $user = Auth::user();
        $device = \App\Models\TrustedDevice::where('user_id', $user->id)->where('id', $id)->first();

        if ($device) {
            $deviceName = $device->device_name;
            $isCurrent = false;

            $currentDevice = $this->trustedDeviceService->getDeviceByRequest($request);
            if ($currentDevice && $currentDevice->id === $device->id) {
                $isCurrent = true;
            }

            $this->trustedDeviceService->removeDevice($user->id, $id);
            event(new DeviceRemoved($user->id, $deviceName, $request));

            if ($isCurrent) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                $this->deviceService->clearDeviceCookies();
                return redirect()->route('login')->with('status', 'Your current device has been removed.');
            }
        }

        return back()->with('status', 'Device removed successfully.');
    }

    public function destroyAllDevices(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $currentDevice = $this->trustedDeviceService->getDeviceByRequest($request);
        $currentDeviceId = $currentDevice ? $currentDevice->id : null;

        $this->trustedDeviceService->removeAllDevices($user->id, $currentDeviceId);
        event(new DeviceRemoved($user->id, 'All other devices', $request));

        return back()->with('status', 'All other devices removed successfully.');
    }

    public function updateDevice(Request $request, $id): RedirectResponse
    {
        $user = Auth::user();
        $device = \App\Models\TrustedDevice::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $request->validate([
            'device_name' => 'required|string|max:255',
        ]);

        $device->update([
            'device_name' => $request->device_name,
        ]);

        return back()->with('status', 'Device renamed successfully.');
    }
}
