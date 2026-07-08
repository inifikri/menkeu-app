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

Route::middleware('auth')->group(function () {
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::post('/users', [UserController::class, 'store'])->name('users.store');
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
        
        return response()->json($log->load('user'));
    })->name('logs.store');

    Route::get('/logs', function(Illuminate\Http\Request $request) {
        $logs = \App\Models\ActivityLog::with('user')->orderBy('created_at', 'desc')->paginate(15);
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

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
