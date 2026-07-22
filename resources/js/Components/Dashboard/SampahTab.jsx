import React, { useState } from "react";
import { Trash2, Tag, Wallet } from "lucide-react";

export default function SampahTab({
    trashTransactions = [],
    trashCategories = [],
    trashWallets = [],
    onRestoreItem,
    onForceDeleteItem,
}) {
    const [trashSubTab, setTrashSubTab] = useState("tx");

    const formatIDR = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <Trash2 className="w-5 h-5 text-rose-400" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black tracking-tight">Kotak Sampah</h2>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 font-medium">
                        Pulihkan data yang tidak sengaja terhapus atau bersihkan data secara permanen.
                    </p>
                </div>
            </div>

            {/* Inner Tabs: Transaksi, Kategori, Kantong */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex gap-2 border-b border-slate-100 pb-4 mb-6 overflow-x-auto">
                    {[
                        { id: "tx", label: "Transaksi", count: trashTransactions.length },
                        { id: "cat", label: "Kategori", count: trashCategories.length },
                        { id: "wallet", label: "Kantong", count: trashWallets.length },
                    ].map((subtab) => (
                        <button
                            key={subtab.id}
                            type="button"
                            onClick={() => setTrashSubTab(subtab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                trashSubTab === subtab.id
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {subtab.label}
                            <span
                                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                    trashSubTab === subtab.id
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-200 text-slate-700"
                                }`}
                            >
                                {subtab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Trash SubTab Content */}
                <div className="space-y-4">
                    {trashSubTab === "tx" && (
                        <div className="space-y-3">
                            {trashTransactions.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-slate-150 rounded-2xl">
                                    <Trash2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-bold text-sm">
                                        Tidak ada transaksi di kotak sampah.
                                    </p>
                                </div>
                            ) : (
                                trashTransactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 hover:border-slate-200 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                                                    tx.type === "income" ? "bg-emerald-500" : "bg-rose-500"
                                                }`}
                                            >
                                                <span className="text-xs font-bold">
                                                    {tx.type === "income" ? "+" : "-"}
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-sm text-slate-800">
                                                    {tx.description}
                                                </h5>
                                                <p className="text-[10px] font-bold text-slate-500">
                                                    {tx.date} •{" "}
                                                    {tx.type === "income" ? "Pemasukan" : "Pengeluaran"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-100 sm:border-0 pt-2 sm:pt-0">
                                            <span
                                                className={`font-black text-sm ${
                                                    tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                                                }`}
                                            >
                                                {tx.type === "income" ? "+" : "-"}
                                                {formatIDR(tx.amount)}
                                            </span>
                                            <div className="flex gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => onRestoreItem("transaction", tx.id)}
                                                    className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Pulihkan"
                                                >
                                                    Pulihkan
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onForceDeleteItem("transaction", tx.id)}
                                                    className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                                    title="Hapus Permanen"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {trashSubTab === "cat" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {trashCategories.length === 0 ? (
                                <div className="col-span-full text-center py-12 border border-dashed border-slate-150 rounded-2xl">
                                    <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-bold text-sm">
                                        Tidak ada kategori di kotak sampah.
                                    </p>
                                </div>
                            ) : (
                                trashCategories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                                                    cat.color || "bg-slate-400"
                                                }`}
                                            >
                                                <span className="text-xs font-bold">
                                                    {cat.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-sm text-slate-800">
                                                    {cat.name}
                                                </h5>
                                                <p className="text-[10px] font-bold text-slate-500">
                                                    Anggaran: {formatIDR(cat.budget)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => onRestoreItem("category", cat.id)}
                                                className="px-2.5 py-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                Pulihkan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onForceDeleteItem("category", cat.id)}
                                                className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {trashSubTab === "wallet" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {trashWallets.length === 0 ? (
                                <div className="col-span-full text-center py-12 border border-dashed border-slate-150 rounded-2xl">
                                    <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-bold text-sm">
                                        Tidak ada kantong di kotak sampah.
                                    </p>
                                </div>
                            ) : (
                                trashWallets.map((w) => (
                                    <div
                                        key={w.id}
                                        className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
                                                <Wallet className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-sm text-slate-800">
                                                    {w.name}
                                                </h5>
                                                <p className="text-[10px] font-bold text-slate-500">
                                                    Saldo: {formatIDR(w.balance)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => onRestoreItem("wallet", w.id)}
                                                className="px-2.5 py-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                Pulihkan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onForceDeleteItem("wallet", w.id)}
                                                className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
