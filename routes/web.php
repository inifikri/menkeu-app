<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');


use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TrashController;

Route::middleware('auth')->group(function () {
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::post('/trash/restore/{type}/{id}', [TrashController::class, 'restore'])->name('trash.restore');
    Route::delete('/trash/force-delete/{type}/{id}', [TrashController::class, 'forceDelete'])->name('trash.forceDelete');

    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::post('/wallets', [App\Http\Controllers\WalletController::class, 'store'])->name('wallets.store');
    Route::put('/wallets/{id}', [App\Http\Controllers\WalletController::class, 'update'])->name('wallets.update');
    Route::delete('/wallets/{id}', [App\Http\Controllers\WalletController::class, 'destroy'])->name('wallets.destroy');

    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::post('/logs', function(Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'action' => 'required|string',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);
        
        $log = \App\Models\ActivityLog::create(array_merge($validated, [
            'user_id' => auth()->id()
        ]));
        
        $log->load('user');
        
        return response()->json([
            'id' => (string) $log->id,
            'action' => $log->action,
            'description' => $log->description,
            'icon' => $log->icon,
            'color' => $log->color,
            'date' => $log->created_at->toISOString(),
            'user' => $log->user ? ['name' => $log->user->name, 'avatarColor' => $log->user->avatarColor] : null,
        ]);
    })->name('logs.store');

    Route::get('/logs', function(Illuminate\Http\Request $request) {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min(100, $perPage));
        $logs = \App\Models\ActivityLog::with('user')->orderBy('created_at', 'desc')->paginate($perPage);
        $logs->getCollection()->transform(function($l) {
            return [
                'id' => (string) $l->id,
                'action' => $l->action,
                'description' => $l->description,
                'icon' => $l->icon,
                'color' => $l->color,
                'date' => $l->created_at->toISOString(),
                'user' => $l->user ? ['name' => $l->user->name, 'avatarColor' => $l->user->avatarColor] : null,
            ];
        });
        return response()->json($logs);
    })->name('logs.index');

    Route::get('/api/dashboard/metrics', function(\Illuminate\Http\Request $request) {
        $force = $request->query('force_recalculate') === 'true';
        $cached = \App\Models\DashboardAnalyticsCache::where('key', 'global_metrics')->first();
        if (!$cached || $force) {
            $service = new \App\Services\DashboardAnalyticsService();
            $data = $service->calculateAndCache();
        } else {
            $data = $cached->data;
        }
        return response()->json($data);
    })->name('dashboard.metrics');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/reset-data', [ProfileController::class, 'resetData'])->name('profile.reset-data');
});

require __DIR__.'/auth.php';
