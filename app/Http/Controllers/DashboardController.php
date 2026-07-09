<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
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
                ];
            }),
            'initialWallets' => Wallet::all()->map(function($w) {
                return [
                    'id' => (string) $w->id,
                    'name' => $w->name,
                    'balance' => (float) $w->balance,
                    'type' => $w->type,
                    'color' => $w->color,
                    'icon' => $w->icon,
                    'userId' => $w->user_id ? (string) $w->user_id : null,
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
                    'deletedAt' => $w->deleted_at->toIso8601String(),
                ];
            }),
            'activeSessions' => \Illuminate\Support\Facades\DB::table('sessions')
                ->where('user_id', auth()->id())
                ->orderBy('last_activity', 'desc')
                ->get()
                ->map(function($s) {
                    return [
                        'id' => $s->id,
                        'ip_address' => $s->ip_address,
                        'user_agent' => $s->user_agent,
                        'last_activity' => \Carbon\Carbon::createFromTimestamp($s->last_activity)->diffForHumans(),
                        'is_current' => $s->id === request()->session()->getId(),
                    ];
                }),
        ]);
    }
}
