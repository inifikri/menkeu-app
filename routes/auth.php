<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest', 'throttle:10,1'])->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', function () {
        return redirect('/');
    })->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    Route::post('pin/login', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'pinLogin'])
        ->name('pin.login');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // Authentication Enhancement Routes
    Route::get('device-register', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'showRegisterDevice'])
        ->name('device.register');
    Route::post('device-register', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'storeRegisterDevice'])
        ->name('device.register.store');
    Route::post('pin/create', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'pinCreate'])
        ->name('pin.create');
    Route::post('pin/reset', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'pinReset'])
        ->name('pin.reset');
    Route::get('trusted-devices', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'indexDevices'])
        ->name('trusted-devices.index');
    Route::delete('trusted-devices/{id}', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'destroyDevice'])
        ->name('trusted-devices.destroy');
    Route::put('trusted-devices/{id}', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'updateDevice'])
        ->name('trusted-devices.update');
    Route::delete('trusted-devices', [\App\Http\Controllers\Auth\AuthenticationEnhancementController::class, 'destroyAllDevices'])
        ->name('trusted-devices.destroy-all');
});
