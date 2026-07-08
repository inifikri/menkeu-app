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
        ]);
    }
}
