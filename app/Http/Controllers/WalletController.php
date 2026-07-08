<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'balance' => 'required|numeric',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        Wallet::create($validated);

        return redirect()->back()->with('message', 'Kantong berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $wallet = Wallet::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'balance' => 'required|numeric',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        $wallet->update($validated);

        return redirect()->back()->with('message', 'Kantong berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $wallet = Wallet::findOrFail($id);
        $wallet->delete();

        return redirect()->back()->with('message', 'Kantong berhasil dihapus.');
    }
}
