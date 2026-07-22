<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWalletRequest;
use App\Http\Requests\UpdateWalletRequest;
use App\Http\Requests\TopUpWalletRequest;
use App\Http\Requests\TransferWalletRequest;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;

class WalletController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Store a newly created wallet.
     */
    public function store(StoreWalletRequest $request): RedirectResponse
    {
        $this->walletService->createWallet($request->validated(), auth()->id());

        event(new \App\Events\BulkTransactionsSaved());

        return redirect()->back()->with('message', 'Kantong berhasil ditambahkan.');
    }

    /**
     * Update the specified wallet.
     */
    public function update(UpdateWalletRequest $request, int $id): RedirectResponse
    {
        $wallet = Wallet::findOrFail($id);
        \Illuminate\Support\Facades\Gate::authorize('update', $wallet);

        $this->walletService->updateWallet($wallet, $request->validated(), $wallet->user_id ?? auth()->id());

        event(new \App\Events\BulkTransactionsSaved());

        return redirect()->back()->with('message', 'Kantong berhasil diperbarui.');
    }

    /**
     * Remove the specified wallet.
     */
    public function destroy(int $id): RedirectResponse
    {
        $wallet = Wallet::findOrFail($id);
        $this->walletService->deleteWallet($wallet, auth()->id());

        event(new \App\Events\BulkTransactionsSaved());

        return redirect()->back()->with('message', 'Kantong berhasil dihapus dan saldo dikembalikan ke Dompet Utama.');
    }

    /**
     * Top up a wallet.
     */
    public function topUp(TopUpWalletRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $targetWallet = Wallet::findOrFail($validated['wallet_id']);
        $sourceWallet = Wallet::findOrFail($validated['source_wallet_id']);

        $this->walletService->topUpWallet(
            $targetWallet,
            $sourceWallet,
            (float) $validated['amount'],
            auth()->user()
        );

        event(new \App\Events\BulkTransactionsSaved());

        if ($sourceWallet->id === $targetWallet->id) {
            return redirect()->back()->with('message', 'Top up Dompet Utama berhasil dilakukan.');
        }

        return redirect()->back()->with('message', 'Top up kantong berhasil dilakukan.');
    }

    /**
     * Transfer funds between wallets.
     */
    public function transfer(TransferWalletRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $sourceWallet = Wallet::findOrFail($validated['source_wallet_id']);
        $targetWallet = Wallet::findOrFail($validated['target_wallet_id']);

        $this->walletService->transferWallet(
            $sourceWallet,
            $targetWallet,
            (float) $validated['amount'],
            auth()->user()
        );

        event(new \App\Events\BulkTransactionsSaved());

        return redirect()->back()->with('message', 'Uang berhasil dipindahkan/ditransfer.');
    }
}
