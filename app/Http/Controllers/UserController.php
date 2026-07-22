<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('manage', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
            'avatarColor' => 'required|string',
            'permissions' => 'nullable|array',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->back()->with('message', 'Anggota berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        \Illuminate\Support\Facades\Gate::authorize('manage', User::class);

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string',
            'permissions' => 'nullable|array',
        ]);

        if (!isset($validated['permissions'])) {
            $validated['permissions'] = [];
        }

        $user->update($validated);

        return redirect()->back()->with('message', 'Data anggota berhasil diperbarui.');
    }

    public function destroy($id)
    {
        \Illuminate\Support\Facades\Gate::authorize('manage', User::class);

        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('message', 'Anggota berhasil dihapus.');
    }
}
