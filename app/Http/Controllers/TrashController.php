<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\Wallet;
use Illuminate\Http\Request;

class TrashController extends Controller
{
    public function restore($type, $id)
    {
        switch ($type) {
            case 'transaction':
                $item = Transaction::onlyTrashed()->findOrFail($id);
                $item->restore();
                
                // Re-apply wallet balance when restoring transaction
                $wallet = Wallet::find($item->wallet_id);
                if ($wallet) {
                    if ($item->type === 'income') {
                        $wallet->balance += $item->amount;
                    } else {
                        $wallet->balance -= $item->amount;
                    }
                    $wallet->save();
                }
                break;
            case 'category':
                $item = Category::onlyTrashed()->findOrFail($id);
                $item->restore();
                break;
            case 'wallet':
                $item = Wallet::onlyTrashed()->findOrFail($id);
                $item->restore();
                break;
            default:
                abort(404, 'Tipe tidak valid.');
        }

        return redirect()->back()->with('message', 'Data berhasil dikembalikan.');
    }

    public function forceDelete($type, $id)
    {
        switch ($type) {
            case 'transaction':
                $item = Transaction::onlyTrashed()->findOrFail($id);
                $item->forceDelete();
                break;
            case 'category':
                $item = Category::onlyTrashed()->findOrFail($id);
                $item->forceDelete();
                break;
            case 'wallet':
                $item = Wallet::onlyTrashed()->findOrFail($id);
                $item->forceDelete();
                break;
            default:
                abort(404, 'Tipe tidak valid.');
        }

        return redirect()->back()->with('message', 'Data berhasil dihapus permanen.');
    }
}
