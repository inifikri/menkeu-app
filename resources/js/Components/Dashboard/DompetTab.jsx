import React, { useState } from "react";
import {
    Plus,
    Wallet,
    CreditCard,
    Building,
    Smartphone,
    Coins,
    Edit,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
} from "lucide-react";

export default function DompetTab({
    wallets,
    transactions,
    categories,
    members,
    currentUser,
    hasPermission,
    selectedMonth,
    selectedYear,
    onOpenAddWallet,
    onOpenEditWallet,
    onDeleteWallet,
    onOpenTopUp,
    onOpenEditTransaction,
    onDeleteTransaction,
}) {
    const [walletSearch, setWalletSearch] = useState("");
    const [walletCategoryFilter, setWalletCategoryFilter] = useState("all");
    const [walletTxPage, setWalletTxPage] = useState(1);

    const formatIDR = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">Kantong Keuangan</h3>
                    <p className="text-xs text-slate-500">Kelola rekening, e-wallet, dan uang tunai Anda</p>
                </div>
                {(hasPermission("kelola_dompet") ||
                    currentUser?.role === "Suami" ||
                    currentUser?.role === "Istri") && (
                    <button
                        onClick={onOpenAddWallet}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Kantong
                    </button>
                )}
            </div>

            {/* List Kantong */}
            <div className="flex sm:grid overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 gap-4 snap-x snap-mandatory sm:grid-cols-2 md:grid-cols-3">
                {wallets.map((w) => {
                    const walletOwner = members.find((m) => m.id === w.userId);
                    const isOwnerIstri =
                        walletOwner?.role?.toLowerCase() === "istri" ||
                        w.name.toLowerCase().includes("istri") ||
                        w.name.toLowerCase().includes("ibu");
                    const isOwnerSuami =
                        walletOwner?.role?.toLowerCase() === "suami" ||
                        w.name.toLowerCase().includes("suami") ||
                        w.name.toLowerCase().includes("bapak") ||
                        w.name.toLowerCase().includes("ayah");

                    const canTopUp =
                        hasPermission("topup_dompet") &&
                        (currentUser?.role?.toLowerCase() === "admin" ||
                            (currentUser?.role?.toLowerCase() === "suami" && !isOwnerIstri) ||
                            (currentUser?.role?.toLowerCase() === "istri" && !isOwnerSuami));

                    const canManageWallet =
                        hasPermission("kelola_dompet") ||
                        (w.userId === currentUser?.id &&
                            (currentUser?.role === "Suami" || currentUser?.role === "Istri"));

                    return (
                        <div
                            key={w.id}
                            className="p-5 rounded-2xl border border-slate-150 bg-white hover:border-slate-300 shadow-sm hover:shadow-md transition-all relative overflow-hidden group shrink-0 w-[82vw] sm:w-auto snap-center"
                        >
                            <div
                                className={`absolute top-0 left-0 right-0 h-1 opacity-80 ${
                                    w.color || "bg-blue-600"
                                }`}
                            ></div>
                            <div
                                className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${
                                    w.color || "bg-blue-600"
                                }`}
                            ></div>
                            <div className="flex items-start justify-between mb-2 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${
                                            w.color || "bg-blue-600"
                                        }`}
                                    >
                                        {w.icon === "Wallet" && <Wallet className="w-5 h-5" />}
                                        {w.icon === "CreditCard" && (
                                            <CreditCard className="w-5 h-5" />
                                        )}
                                        {w.icon === "Building" && <Building className="w-5 h-5" />}
                                        {w.icon === "Smartphone" && (
                                            <Smartphone className="w-5 h-5" />
                                        )}
                                        {w.icon === "Coins" && <Coins className="w-5 h-5" />}
                                        {!["Wallet", "CreditCard", "Building", "Smartphone", "Coins"].includes(
                                            w.icon
                                        ) && <Wallet className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 leading-tight">
                                            {w.name}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            {w.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {canManageWallet && (
                                        <>
                                            <button
                                                onClick={() => onOpenEditWallet(w)}
                                                className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteWallet(w.id)}
                                                className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="relative z-10 flex items-end justify-between mt-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Total Saldo</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tight">
                                        {formatIDR(w.balance)}
                                    </p>
                                </div>
                                {canTopUp && (
                                    <button
                                        onClick={() => onOpenTopUp(w.id)}
                                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors animate-pulseHover"
                                    >
                                        <Plus className="w-3 h-3" /> Top Up
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Transaksi Section */}
            <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Riwayat Transaksi</h3>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={walletSearch}
                            onChange={(e) => {
                                setWalletSearch(e.target.value);
                                setWalletTxPage(1);
                            }}
                            placeholder="Cari deskripsi transaksi..."
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <select
                            value={walletCategoryFilter}
                            onChange={(e) => {
                                setWalletCategoryFilter(e.target.value);
                                setWalletTxPage(1);
                            }}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    {(() => {
                        const walletTxPerPage = 15;
                        const filteredWalletTxs = transactions
                            .filter((t) => {
                                const d = new Date(t.date);
                                return (
                                    d.getMonth() + 1 === selectedMonth &&
                                    d.getFullYear() === selectedYear
                                );
                            })
                            .filter((t) =>
                                walletSearch
                                    ? t.description.toLowerCase().includes(walletSearch.toLowerCase())
                                    : true
                            )
                            .filter((t) =>
                                walletCategoryFilter !== "all"
                                    ? t.categoryId == walletCategoryFilter
                                    : true
                            )
                            .sort((a, b) => new Date(b.date) - new Date(a.date));

                        const totalWalletPages =
                            Math.ceil(filteredWalletTxs.length / walletTxPerPage) || 1;
                        const currentPg = Math.min(walletTxPage, totalWalletPages);
                        const paginatedWalletTxs = filteredWalletTxs.slice(
                            (currentPg - 1) * walletTxPerPage,
                            currentPg * walletTxPerPage
                        );

                        if (filteredWalletTxs.length === 0) {
                            return (
                                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-bold">
                                        Tidak ada transaksi yang cocok di bulan ini.
                                    </p>
                                </div>
                            );
                        }

                        const grouped = paginatedWalletTxs.reduce((groups, t) => {
                            const date = t.date;
                            if (!groups[date]) groups[date] = [];
                            groups[date].push(t);
                            return groups;
                        }, {});

                        return (
                            <>
                                {Object.entries(grouped).map(([date, txs]) => (
                                    <div key={date}>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                            {new Date(date).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </h4>
                                        <div className="space-y-2">
                                            {txs.map((t) => {
                                                const cat = categories.find((c) => c.id == t.categoryId);
                                                const wal = wallets.find((w) => w.id == t.walletId);
                                                const isIncome = t.type === "income";
                                                return (
                                                    <div
                                                        key={t.id}
                                                        className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-200 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                                                                    isIncome
                                                                        ? "bg-emerald-500"
                                                                        : cat?.color || "bg-slate-400"
                                                                }`}
                                                            >
                                                                <div className="text-xs font-bold">
                                                                    {isIncome ? "+" : cat?.name?.charAt(0) || "?"}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-sm text-slate-900 font-sans">
                                                                    {t.description}
                                                                </h5>
                                                                <p className="text-[10px] font-bold text-slate-500">
                                                                    {isIncome
                                                                        ? "Pemasukan"
                                                                        : cat?.name || "Tanpa Kategori"}{" "}
                                                                    • {wal?.name || "Tanpa Dompet"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-50 pt-2 sm:pt-0 sm:border-0">
                                                            <div
                                                                className={`font-bold ${
                                                                    t.type === "income"
                                                                        ? "text-emerald-600"
                                                                        : "text-rose-600"
                                                                }`}
                                                            >
                                                                {t.type === "income" ? "+" : "-"}
                                                                {formatIDR(t.amount)}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    onClick={() => onOpenEditTransaction(t)}
                                                                    className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                                                                    title="Ubah Transaksi"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        onDeleteTransaction(
                                                                            t.id,
                                                                            t.type,
                                                                            t.amount,
                                                                            t.walletId
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                                                                    title="Hapus Transaksi"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Controls */}
                                {totalWalletPages > 1 && (
                                    <div className="flex items-center justify-center pt-6 gap-2">
                                        <button
                                            onClick={() => setWalletTxPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPg === 1}
                                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 shadow-sm"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <div className="flex gap-1.5">
                                            {Array.from(
                                                { length: totalWalletPages },
                                                (_, i) => i + 1
                                            ).map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setWalletTxPage(pageNum)}
                                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                                        currentPg === pageNum
                                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() =>
                                                setWalletTxPage((p) => Math.min(totalWalletPages, p + 1))
                                            }
                                            disabled={currentPg === totalWalletPages}
                                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 shadow-sm"
                                        >
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
