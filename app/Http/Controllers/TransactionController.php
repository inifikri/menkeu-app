<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\RedirectResponse;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Store a newly created bulk transactions.
     */
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $this->transactionService->storeBulkTransactions($validated['transactions']);

        event(new \App\Events\BulkTransactionsSaved());

        return redirect()->back()->with('message', 'Transaksi berhasil ditambahkan.');
    }

    /**
     * Update the specified transaction.
     */
    public function update(UpdateTransactionRequest $request, int $id): RedirectResponse
    {
        $transaction = Transaction::findOrFail($id);
        \Illuminate\Support\Facades\Gate::authorize('update', $transaction);

        $this->transactionService->updateTransaction($transaction, $request->validated());

        return redirect()->back()->with('message', 'Transaksi berhasil diperbarui.');
    }

    /**
     * Remove the specified transaction.
     */
    public function destroy(int $id): RedirectResponse
    {
        $transaction = Transaction::findOrFail($id);
        \Illuminate\Support\Facades\Gate::authorize('delete', $transaction);

        $this->transactionService->deleteTransaction($transaction);

        return redirect()->back()->with('message', 'Transaksi berhasil dihapus.');
    }
}
