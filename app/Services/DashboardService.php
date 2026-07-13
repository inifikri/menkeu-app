<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\DashboardAnalyticsService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    protected $analyticsService;

    public function __construct(DashboardAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Ensure the authenticated user has a primary wallet (Dompet Utama).
     */
    public function ensureUserHasPrimaryWallet($user): void
    {
        if (!$user) {
            return;
        }

        $hasUtama = Wallet::where('user_id', $user->id)->where('is_utama', true)->exists();
        if (!$hasUtama) {
            $firstWallet = Wallet::where('user_id', $user->id)->first();
            if ($firstWallet) {
                $firstWallet->is_utama = true;
                $firstWallet->save();
            } else {
                Wallet::create([
                    'name' => 'Dompet Utama',
                    'balance' => 0,
                    'type' => 'Tunai',
                    'is_utama' => true,
                    'user_id' => $user->id,
                    'color' => 'bg-blue-600',
                    'icon' => 'Wallet',
                ]);
            }

            // Recalculate metrics in case we added/changed a wallet
            $this->analyticsService->calculateAndCache();
        }
    }

    /**
     * Get all raw data needed for the dashboard view.
     */
    public function getDashboardData(?int $currentUserId, string $currentSessionId): array
    {
        return [
            'initialMembers' => User::all()->map(function($u) {
                return [
                    'id' => (string) $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'avatarColor' => $u->avatarColor,
                    'permissions' => $u->permissions ?? [],
                ];
            }),
            'initialCategories' => Category::all()->map(function($c) {
                return [
                    'id' => (string) $c->id,
                    'name' => $c->name,
                    'icon' => $c->icon,
                    'color' => $c->color,
                    'budget' => (float) $c->budget,
                    'parentId' => $c->parent_id ? (string) $c->parent_id : null,
                    'priorityLevel' => (int) $c->priority_level,
                ];
            }),
            'initialWallets' => Wallet::with('user')->get()->map(function($w) {
                return [
                    'id' => (string) $w->id,
                    'name' => $w->name,
                    'balance' => (float) $w->balance,
                    'type' => $w->type,
                    'color' => $w->color,
                    'icon' => $w->icon,
                    'userId' => $w->user_id ? (string) $w->user_id : null,
                    'isUtama' => (bool) $w->is_utama,
                ];
            }),
            'initialTransactions' => Transaction::orderBy('date', 'desc')->get()->map(function($t) {
                return [
                    'id' => (string) $t->id,
                    'description' => $t->description,
                    'amount' => (float) $t->amount,
                    'type' => $t->type,
                    'date' => $t->date,
                    'categoryId' => (string) $t->category_id,
                    'walletId' => (string) $t->wallet_id,
                    'memberId' => (string) $t->user_id,
                ];
            }),
            'initialTrashTransactions' => Transaction::onlyTrashed()->orderBy('deleted_at', 'desc')->get()->map(function($t) {
                return [
                    'id' => (string) $t->id,
                    'description' => $t->description,
                    'amount' => (float) $t->amount,
                    'type' => $t->type,
                    'date' => $t->date,
                    'categoryId' => (string) $t->category_id,
                    'walletId' => (string) $t->wallet_id,
                    'memberId' => (string) $t->user_id,
                    'deletedAt' => $t->deleted_at->toIso8601String(),
                ];
            }),
             'initialTrashCategories' => Category::onlyTrashed()->orderBy('deleted_at', 'desc')->get()->map(function($c) {
                return [
                    'id' => (string) $c->id,
                    'name' => $c->name,
                    'icon' => $c->icon,
                    'color' => $c->color,
                    'budget' => (float) $c->budget,
                    'parentId' => $c->parent_id ? (string) $c->parent_id : null,
                    'priorityLevel' => (int) $c->priority_level,
                    'deletedAt' => $c->deleted_at->toIso8601String(),
                ];
            }),
            'initialTrashWallets' => Wallet::onlyTrashed()->orderBy('deleted_at', 'desc')->get()->map(function($w) {
                return [
                    'id' => (string) $w->id,
                    'name' => $w->name,
                    'balance' => (float) $w->balance,
                    'type' => $w->type,
                    'color' => $w->color,
                    'icon' => $w->icon,
                    'userId' => $w->user_id ? (string) $w->user_id : null,
                    'isUtama' => (bool) $w->is_utama,
                    'deletedAt' => $w->deleted_at->toIso8601String(),
                ];
            }),
            'activeSessions' => $currentUserId ? DB::table('sessions')
                ->where('user_id', $currentUserId)
                ->orderBy('last_activity', 'desc')
                ->get()
                ->map(function($s) use ($currentSessionId) {
                    return [
                        'id' => $s->id,
                        'ip_address' => $s->ip_address,
                        'user_agent' => $s->user_agent,
                        'last_activity' => Carbon::createFromTimestamp($s->last_activity)->diffForHumans(),
                        'is_current' => $s->id === $currentSessionId,
                    ];
                }) : collect([]),
        ];
    }

    /**
     * Get dashboard metrics (with caching support).
     */
    public function getMetrics(bool $force): array
    {
        $cached = \App\Models\DashboardAnalyticsCache::where('key', 'global_metrics')->first();
        if (!$cached || $force) {
            return $this->analyticsService->calculateAndCache();
        }
        return $cached->data;
    }
}
