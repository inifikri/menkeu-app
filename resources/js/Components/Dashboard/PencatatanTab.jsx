import React from "react";
import { Plus, Trash, Check } from "lucide-react";

export default function PencatatanTab({
    categories,
    wallets,
    members,
    currentUser,
    bulkTransactions,
    setBulkTransactions,
    onSaveBulkTransactions,
    onCancel,
}) {
    const handleAddBulkRow = () => {
        setBulkTransactions([
            ...bulkTransactions,
            {
                id: "bulk_" + Date.now() + "_" + bulkTransactions.length,
                description: "",
                amount: "",
                type: "expense",
                categoryId: categories[0]?.id || "",
                walletId: wallets[0]?.id || "",
                memberId: currentUser?.id || members[0]?.id || "",
                date: new Date().toISOString().split("T")[0],
            },
        ]);
    };

    const handleRemoveBulkRow = (index) => {
        if (bulkTransactions.length === 1) {
            return;
        }
        setBulkTransactions(bulkTransactions.filter((_, i) => i !== index));
    };

    const handleUpdateBulkField = (index, field, value) => {
        const updated = [...bulkTransactions];
        updated[index][field] = value;
        setBulkTransactions(updated);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* HALAMAN INPUT TRANSAKSI BARU (MODERN & SIMPLE) */}
            <div className="space-y-4 animate-fadeIn">
                <form onSubmit={onSaveBulkTransactions} className="space-y-4">
                    {bulkTransactions.map((tx, idx) => (
                        <div
                            key={tx.id}
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group transition-all hover:shadow-md"
                        >
                            {/* Tombol Hapus Baris */}
                            {bulkTransactions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveBulkRow(idx)}
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-rose-100 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 shadow-sm transition-all z-10"
                                    title="Hapus"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            )}
                            {/* Header Baris / Nomor Form */}
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">
                                        Catatan Pengeluaran
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">
                                    {idx + 1} dari {bulkTransactions.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* 1. Nominal (Paling atas) */}
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                        Nominal
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-slate-500 font-bold text-lg">Rp</span>
                                        </div>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            value={
                                                tx.amount
                                                    ? new Intl.NumberFormat("id-ID").format(tx.amount)
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\D/g, "");
                                                handleUpdateBulkField(
                                                    idx,
                                                    "amount",
                                                    rawValue ? parseInt(rawValue, 10) : ""
                                                );
                                            }}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-lg font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            autoFocus={idx === 0}
                                        />
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                        Catatan / Deskripsi
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Makan siang, bensin, dll..."
                                        value={tx.description}
                                        onChange={(e) =>
                                            handleUpdateBulkField(idx, "description", e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* 2. Kategori */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                        Kategori
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={tx.categoryId}
                                            onChange={(e) =>
                                                handleUpdateBulkField(idx, "categoryId", e.target.value)
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                        >
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 3. Dompet */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                        Dompet / Sumber Dana
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={tx.walletId}
                                            onChange={(e) =>
                                                handleUpdateBulkField(idx, "walletId", e.target.value)
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                        >
                                            {wallets.map((w) => (
                                                <option key={w.id} value={w.id}>
                                                    {w.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 4. Tanggal */}
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={tx.date}
                                        onChange={(e) =>
                                            handleUpdateBulkField(idx, "date", e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Button Tambah Baris */}
                    <button
                        type="button"
                        onClick={handleAddBulkRow}
                        className="w-full py-4 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 font-bold text-sm flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Baris</span>
                    </button>

                    {/* Action Buttons: Batal & Simpan */}
                    <div className="flex items-center justify-end space-x-4 pt-6 pb-32 md:pb-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center space-x-2"
                        >
                            <Check className="w-4 h-4" />
                            <span>Simpan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
