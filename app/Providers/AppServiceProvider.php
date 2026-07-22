<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \Illuminate\Support\Facades\Event::listen(
            \App\Events\BulkTransactionsSaved::class,
            \App\Listeners\CalculateDashboardAnalytics::class
        );

        \Illuminate\Support\Facades\Event::listen(
            \App\Events\DeviceRegistered::class,
            \App\Listeners\SecurityLogListener::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\PinCreated::class,
            \App\Listeners\SecurityLogListener::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\PinChanged::class,
            \App\Listeners\SecurityLogListener::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\DeviceRemoved::class,
            \App\Listeners\SecurityLogListener::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\LoginUsingPIN::class,
            \App\Listeners\SecurityLogListener::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\LoginUsingPIN::class,
            \App\Listeners\UpdateLastLoginListener::class
        );

        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Login::class,
            \App\Listeners\SecurityLogListener::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Logout::class,
            \App\Listeners\SecurityLogListener::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \Illuminate\Auth\Events\Failed::class,
            \App\Listeners\SecurityLogListener::class
        );
    }
}
