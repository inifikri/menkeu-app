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
use App\Http\Controllers\ActivityLogController;

Route::middleware('auth')->group(function () {
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::post('/trash/restore/{type}/{id}', [TrashController::class, 'restore'])->name('trash.restore');
    Route::delete('/trash/force-delete/{type}/{id}', [TrashController::class, 'forceDelete'])->name('trash.forceDelete');

    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::post('/budget/waterfall', [App\Http\Controllers\BudgetController::class, 'runWaterfall'])->name('budget.waterfall');
    Route::post('/budget/close-month', [App\Http\Controllers\BudgetController::class, 'closeMonth'])->name('budget.close-month');
    Route::get('/budget/snapshots', [App\Http\Controllers\BudgetController::class, 'getSnapshots'])->name('budget.snapshots');

    Route::post('/wallets', [App\Http\Controllers\WalletController::class, 'store'])->name('wallets.store');
    Route::put('/wallets/{id}', [App\Http\Controllers\WalletController::class, 'update'])->name('wallets.update');
    Route::delete('/wallets/{id}', [App\Http\Controllers\WalletController::class, 'destroy'])->name('wallets.destroy');
    Route::post('/wallets/top-up', [App\Http\Controllers\WalletController::class, 'topUp'])->name('wallets.top-up');
    Route::post('/wallets/transfer', [App\Http\Controllers\WalletController::class, 'transfer'])->name('wallets.transfer');

    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');



    Route::post('/logs', [ActivityLogController::class, 'store'])->name('logs.store');
    Route::get('/logs', [ActivityLogController::class, 'index'])->name('logs.index');

    Route::get('/api/dashboard/metrics', [DashboardController::class, 'metrics'])->name('dashboard.metrics');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/reset-data', [ProfileController::class, 'resetData'])->name('profile.reset-data');
});

require __DIR__.'/auth.php';
