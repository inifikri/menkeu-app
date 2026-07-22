import React from "react";
import { X } from "lucide-react";

export default function EditTransactionModal({
    isOpen,
    onClose,
    onSubmit,
    editingTx,
    setEditingTx,
    categories,
    wallets,
}) {
    if (!isOpen || !editingTx) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-150 max-w-lg w-full p-6 shadow-xl space-y-4 animate-scaleUp">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-base">Ubah Transaksi</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Nominal (Rp) - Readonly / Disabled with Format Rupiah */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                            Nominal (Rp)
                        </label>
                        <input
                            type="text"
                            value={
                                editingTx.amount
                                    ? `Rp ${parseInt(
                                          editingTx.amount.toString().replace(/[^0-9]/g, "") || 0
                                      ).toLocaleString("id-ID")}`
                                    : ""
                            }
                            disabled
                            className="w-full px-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed rounded-lg text-xs font-bold"
                        />
                    </div>

                    {/* Kategori & Dompet */}
                    {editingTx.type !== "income" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                    Kategori
                                </label>
                                <select
                                    value={editingTx.categoryId}
                                    onChange={(e) =>
                                        setEditingTx({
                                            ...editingTx,
                                            categoryId: e.target.value,
                                        })
                                    }
                                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                    Dompet
                                </label>
                                <select
                                    value={editingTx.walletId}
                                    onChange={(e) =>
                                        setEditingTx({
                                            ...editingTx,
                                            walletId: e.target.value,
                                        })
                                    }
                                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-1 focus:ring-blue-500"
                                >
                                    {wallets.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Tanggal */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            value={editingTx.date}
                            onChange={(e) =>
                                setEditingTx({
                                    ...editingTx,
                                    date: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Deskripsi (at the bottom) */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                            Deskripsi
                        </label>
                        <input
                            type="text"
                            value={editingTx.description}
                            onChange={(e) =>
                                setEditingTx({
                                    ...editingTx,
                                    description: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 text-slate-800"
                        />
                    </div>

                    {/* Anggota (Hidden input, because member is determined by active login session) */}
                    <input type="hidden" value={editingTx.memberId} />

                    <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
