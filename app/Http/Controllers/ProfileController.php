<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): RedirectResponse
    {
        return Redirect::route('dashboard');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->safe()->except('avatar'));

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->avatar)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }
            
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Reset transaction data for selected months.
     */
    public function resetData(Request $request): RedirectResponse
    {
        $request->validate([
            'months' => 'required|array',
            'months.*' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'role' => 'nullable|string|in:all,Suami,Istri',
        ]);

        $months = $request->input('months');
        $role = $request->input('role', 'all');
        $userIds = [];
        if ($role !== 'all') {
            $userIds = \App\Models\User::where('role', $role)->pluck('id')->toArray();
        }

        foreach ($months as $month) {
            $startDate = $month . '-01';
            $endDate = date('Y-m-t', strtotime($startDate));

            $query = \App\Models\Transaction::whereBetween('date', [$startDate, $endDate]);
            if ($role !== 'all') {
                $query->whereIn('user_id', $userIds);
            }
            $transactions = $query->get();

            foreach ($transactions as $transaction) {
                $transaction->delete();
            }

            \App\Models\ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'Reset Data',
                'description' => "Mereset data transaksi " . ($role !== 'all' ? "untuk role $role " : "") . "pada bulan " . date('F Y', strtotime($startDate)),
                'icon' => 'RotateCcw',
                'color' => 'bg-rose-500'
            ]);
        }

        if ($role === 'all') {
            // Disable FK to avoid constraint errors during deletion
            \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
            
            // Hapus semua data kategori dan dompet (tanpa membuat default)
            \App\Models\Category::query()->delete();
            \App\Models\Wallet::query()->delete();
            
            // Hapus seluruh sisa transaksi 
            \App\Models\Transaction::query()->delete();

            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

            \App\Models\ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'Reset Data',
                'description' => "Mereset seluruh kategori dan kantong ke data bawaan",
                'icon' => 'RotateCcw',
                'color' => 'bg-rose-500'
            ]);
        }

        // Recalculate wallet balances from remaining transactions
        $remainingTransactions = \App\Models\Transaction::all();
        foreach ($remainingTransactions as $transaction) {
            $wallet = \App\Models\Wallet::find($transaction->wallet_id);
            if ($wallet) {
                if ($transaction->type === 'income') {
                    $wallet->balance += $transaction->amount;
                } else {
                    $wallet->balance -= $transaction->amount;
                }
                $wallet->save();
            }
        }

        event(new \App\Events\BulkTransactionsSaved());
        $analyticsService = new \App\Services\DashboardAnalyticsService();
        $analyticsService->calculateAndCache();

        return Redirect::back()->with('message', 'Data transaksi untuk bulan terpilih, kategori, dan kantong/dompet berhasil di-reset.');
    }
}
