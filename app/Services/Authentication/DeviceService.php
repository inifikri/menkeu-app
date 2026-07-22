<?php

namespace App\Services\Authentication;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Request;

class DeviceService
{
    public function getDeviceUuidFromCookie(Request $request): ?string
    {
        return $request->cookie('device_uuid');
    }

    public function getDeviceTokenFromCookie(Request $request): ?string
    {
        return $request->cookie('device_token');
    }

    public function setDeviceCookies(string $uuid, string $token, int $days = 30): void
    {
        $minutes = $days * 24 * 60;
        $secure = request()->isSecure();
        
        // HttpOnly, Secure, SameSite=Strict
        Cookie::queue(
            Cookie::make('device_uuid', $uuid, $minutes, '/', null, $secure, true, false, 'Strict')
        );
        Cookie::queue(
            Cookie::make('device_token', $token, $minutes, '/', null, $secure, true, false, 'Strict')
        );
    }

    public function clearDeviceCookies(): void
    {
        Cookie::queue(Cookie::forget('device_uuid'));
        Cookie::queue(Cookie::forget('device_token'));
    }

    public function detectBrowser(string $userAgent): string
    {
        $browser = 'Unknown Browser';

        if (preg_match('/MSIE/i', $userAgent) && !preg_match('/Opera/i', $userAgent)) {
            $browser = 'Internet Explorer';
        } elseif (preg_match('/Firefox/i', $userAgent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Chrome/i', $userAgent)) {
            if (preg_match('/Edg/i', $userAgent)) {
                $browser = 'Microsoft Edge';
            } elseif (preg_match('/OPR/i', $userAgent) || preg_match('/Opera/i', $userAgent)) {
                $browser = 'Opera';
            } else {
                $browser = 'Chrome';
            }
        } elseif (preg_match('/Safari/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/Opera/i', $userAgent)) {
            $browser = 'Opera';
        } elseif (preg_match('/Netscape/i', $userAgent)) {
            $browser = 'Netscape';
        }

        return $browser;
    }

    public function detectPlatform(string $userAgent): string
    {
        $platform = 'Unknown OS';

        if (preg_match('/windows|win32/i', $userAgent)) {
            $platform = 'Windows';
        } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
            $platform = 'macOS';
        } elseif (preg_match('/linux/i', $userAgent)) {
            $platform = 'Linux';
        } elseif (preg_match('/iphone|ipad|ipod/i', $userAgent)) {
            $platform = 'iOS';
        } elseif (preg_match('/android/i', $userAgent)) {
            $platform = 'Android';
        }

        return $platform;
    }
}
