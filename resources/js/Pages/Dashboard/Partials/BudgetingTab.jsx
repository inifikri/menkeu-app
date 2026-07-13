import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import {
    Utensils,
    Car,
    FileText,
    Tv,
    HeartPulse,
    Grid,
    Plus,
    RefreshCw,
    Lock,
    Check,
    ChevronDown,
    PieChart,
    Calendar,
    BadgeCheck,
    Pizza,
    Train,
    ParkingCircle,
    Home,
    Cigarette,
    Wrench,
    Fuel,
    ShoppingBasket,
    Droplets,
    Wifi,
    Coffee,
    CreditCard,
    Apple
} from "lucide-react";

const ICON_MAP = {
    Utensils,
    Car,
    FileText,
    Tv,
    HeartPulse,
    Grid,
    Pizza,
    Train,
    ParkingCircle,
    Home,
    Cigarette,
    Wrench,
    Fuel,
    ShoppingBasket,
    Droplets,
    Wifi,
    Coffee,
    CreditCard,
    Apple
};

const isParentCategory = (cat) => {
    if (!cat) return false;
    return !cat.parentId && [
        "Kebutuhan Pokok",
        "Transportasi & Kerja",
        "Kebutuhan Pendukung",
        "Kesehatan & Perawatan",
        "Gaya Hidup & Konsumtif"
    ].includes(cat.name);
};

const formatNumberWithDots = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const clean = val.toString().replace(/[^0-9]/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(clean));
};


export default function BudgetingTab({
    categories,
    transactions,
    wallets,
    budgetStartDate,
    budgetEndDate,
    formatIDR,
    showToast,
    setActiveTab,
    handleStartAddTransaction,
    currentUser
}) {
    const isIstri = currentUser?.role === "Istri";
    const canAturBudget = currentUser ? currentUser.permissions?.includes("atur_budget") : true;
    const [budgetSubTab, setBudgetSubTab] = useState("status");
    const [draftBudgets, setDraftBudgets] = useState({});
    const [snapshots, setSnapshots] = useState([]);
    const [loadingSnapshots, setLoadingSnapshots] = useState(false);
    const [closeMonthValue, setCloseMonthValue] = useState("2026-07");
    const [expandedSnapshotMonth, setExpandedSnapshotMonth] = useState(null);

    const fetchSnapshots = async () => {
        setLoadingSnapshots(true);
        try {
            const response = await axios.get('/budget/snapshots');
            if (response.data && Array.isArray(response.data)) {
                setSnapshots(response.data);
            } else {
                setSnapshots([]);
            }
        } catch (err) {
            console.error('Failed to fetch snapshots:', err);
            setSnapshots([]);
        } finally {
            setLoadingSnapshots(false);
        }
    };

    useEffect(() => {
        if (budgetSubTab === "rekonsiliasi") {
            fetchSnapshots();
        }
    }, [budgetSubTab]);

    const handleSaveCategoryBudget = (cat, val) => {
        const newBudget = parseFloat(val) || 0;
        router.put(`/categories/${cat.id}`, {
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            budget: newBudget,
            parent_id: cat.parentId,
            priority_level: cat.priorityLevel
        }, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`Anggaran ${cat.name} berhasil diperbarui.`);
                setDraftBudgets(prev => {
                    const next = { ...prev };
                    delete next[cat.id];
                    return next;
                });
            },
            onError: (err) => {
                showToast(err.budget || "Gagal memperbarui anggaran", "error");
            }
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Sub-tabs for budgeting navigation - Modern Segmented Control */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1.5 rounded-2xl mb-6">
                <button
                    onClick={() => setBudgetSubTab("status")}
                    className={`px-2 py-3 text-[10px] md:text-xs font-black rounded-xl tracking-tight transition-all flex items-center justify-center gap-1.5 ${budgetSubTab === "status" ? "bg-white text-slate-900 shadow-sm border border-slate-200/30" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <PieChart className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                    <span className="truncate">Status Anggaran</span>
                </button>
                <button
                    onClick={() => setBudgetSubTab("rencana")}
                    className={`px-2 py-3 text-[10px] md:text-xs font-black rounded-xl tracking-tight transition-all flex items-center justify-center gap-1.5 ${budgetSubTab === "rencana" ? "bg-white text-slate-900 shadow-sm border border-slate-200/30" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
                    <span className="truncate">Perencanaan</span>
                </button>
                <button
                    onClick={() => setBudgetSubTab("rekonsiliasi")}
                    className={`px-2 py-3 text-[10px] md:text-xs font-black rounded-xl tracking-tight transition-all flex items-center justify-center gap-1.5 ${budgetSubTab === "rekonsiliasi" ? "bg-white text-slate-900 shadow-sm border border-slate-200/30" : "text-slate-500 hover:text-slate-700"}`}
                >
                    <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
                    <span className="truncate">Tutup Bulan</span>
                </button>
            </div>

            {/* Sub-tab 1: Status Anggaran Aktif */}
            {budgetSubTab === "status" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-base font-black text-slate-800 tracking-tight">Status Anggaran Aktif</h3>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Pemantauan real-time budget limit dibanding pengeluaran riil</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                            let txs = transactions.filter((t) => t.type === "expense");
                            if (budgetStartDate) txs = txs.filter((t) => t.date >= budgetStartDate);
                            if (budgetEndDate) txs = txs.filter((t) => t.date <= budgetEndDate);

                            const stats = categories
                                .filter(c => !isParentCategory(c))
                                .map((cat) => {
                                    const spent = txs
                                        .filter((t) => t.categoryId === cat.id)
                                        .reduce((sum, t) => sum + t.amount, 0);
                                    const percentage = cat.budget > 0
                                        ? Math.min((spent / cat.budget) * 100, 100)
                                        : 0;
                                    return {
                                        ...cat,
                                        spent,
                                        percentage,
                                    };
                                })
                                .sort((a, b) => b.spent - a.spent);

                            return stats.map((cat) => {
                                const IconComponent = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : Grid;
                                const isOverBudget = cat.spent > cat.budget;
                                const isWarning = !isOverBudget && cat.percentage > 80;

                                let barColor = "bg-blue-500";
                                if (isOverBudget) barColor = "bg-rose-500";
                                else if (isWarning) barColor = "bg-amber-500";
                                else if (cat.color) barColor = cat.color;

                                const borderColor = cat.color ? cat.color.replace("bg-", "border-") : "border-slate-200";

                                return (
                                    <div
                                        key={cat.id}
                                        className={`p-5 rounded-2xl border-2 ${borderColor} bg-white shadow-sm hover:shadow-md transition-all`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.color ? cat.color.replace("-500", "-100") : "bg-slate-100"}`}
                                                >
                                                    <IconComponent
                                                        className={`w-4 h-4 ${cat.color ? cat.color.replace("bg-", "text-").replace("-500", "-600") : "text-slate-500"}`}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800">{cat.name}</h4>
                                                    <p className="text-[10px] font-semibold text-slate-400">Plafon: {formatIDR(cat.budget)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <span className={`text-sm font-black ${isOverBudget ? "text-rose-600" : "text-slate-800"}`}>
                                                    {formatIDR(cat.spent)}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 mt-0.5">Terpakai</span>
                                            </div>
                                        </div>

                                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${barColor} transition-all duration-700`}
                                                style={{ width: `${Math.max(cat.percentage, 2)}%` }}
                                            />
                                        </div>

                                        <div className="flex justify-between items-center mt-2.5">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isOverBudget ? "bg-rose-100 text-rose-600" : isWarning ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-600"}`}
                                            >
                                                {isOverBudget ? "Over budget!" : isWarning ? "Hampir habis" : "Aman"}
                                            </span>
                                            <span className={`text-xs font-bold ${isOverBudget ? "text-rose-600" : "text-slate-600"}`}>
                                                {cat.percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            )}

            {/* Sub-tab 2: Fase Perencanaan (Sequential Form) */}
            {budgetSubTab === "rencana" && (() => {
                const dompetUtama = wallets.find(w => w.isUtama || w.is_utama);
                const totalIncome = dompetUtama ? parseFloat(dompetUtama.balance) : 0;
                const totalBudget1to4 = categories
                    .filter(c => c.priorityLevel >= 1 && c.priorityLevel <= 4 && !isParentCategory(c))
                    .reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);
                const sisaDanaLevel5 = Math.max(0, totalIncome - totalBudget1to4);

                const isLevelEnabled = (level) => {
                    if (level === 1) return true;
                    for (let l = 1; l < level; l++) {
                        const catsInL = categories.filter(c => c.priorityLevel === l && !isParentCategory(c));
                        if (catsInL.length > 0 && catsInL.some(c => !c.budget || parseFloat(c.budget) <= 0)) {
                            return false;
                        }
                    }
                    return true;
                };

                const handleTriggerWaterfall = () => {
                    if (confirm("Apakah Anda yakin ingin menjalankan Waterfall Allocation? Aksi ini akan menghitung sisa dana dari Dompet Utama dan membagikannya secara merata ke Kategori Level 5 secara otomatis.")) {
                        axios.post('/budget/waterfall')
                            .then(res => {
                                showToast("Waterfall allocation berhasil dijalankan!");
                                router.reload({ preserveScroll: true });
                            })
                            .catch(err => {
                                const msg = err.response?.data?.message || "Gagal menjalankan waterfall";
                                showToast(msg, "error");
                            });
                    }
                };

                const priorityLevelsInfo = [
                    { level: 1, name: "Prioritas 1: Kebutuhan Pokok", desc: "Makan, Kebutuhan Dapur, Pokok" },
                    { level: 2, name: "Prioritas 2: Transportasi & Kerja", desc: "Bensin, KRL, Penitipan Motor, Permotoran" },
                    { level: 3, name: "Prioritas 3: Kebutuhan Pendukung", desc: "Kuota, Kebersihan" },
                    { level: 4, name: "Prioritas 4: Kesehatan & Perawatan", desc: "Skincare & Bodycare, Buah-buahan" },
                    { level: 5, name: "Prioritas 5: Gaya Hidup & Konsumtif", desc: "Jajan, Ngopi, Rokok, Piutang, Lainnya" }
                ];

                return (
                    <div className="space-y-6">
                        {/* Header Summary Card */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-base font-black tracking-tight text-slate-100">Fase Perencanaan Anggaran</h3>
                                    <p className="text-xs text-slate-400 font-medium">Alokasi otomatis dana dari Dompet Utama berbasis prioritas secara bertingkat.</p>
                                </div>
                                {!isIstri && (
                                    <button
                                        onClick={handleTriggerWaterfall}
                                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                                        Jalankan Waterfall Allocation
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-800">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dompet Utama (Baseline)</div>
                                    <div className="text-xl font-black text-slate-100 mt-1">{formatIDR(totalIncome)}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Prioritas 1-4</div>
                                    <div className="text-xl font-black text-blue-400 mt-1">{formatIDR(totalBudget1to4)}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sisa Dana (Level 5)</div>
                                    <div className="text-xl font-black text-emerald-400 mt-1">{formatIDR(sisaDanaLevel5)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Sequential Form */}
                        <div className="space-y-6">
                            {priorityLevelsInfo.map(({ level, name, desc }) => {
                                const enabled = isLevelEnabled(level);
                                const cats = categories.filter(c => c.priorityLevel === level && !isParentCategory(c));
                                const levelBudgetSum = cats.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);

                                return (
                                    <div 
                                        key={level} 
                                        className={`p-6 rounded-3xl border transition-all duration-300 bg-white ${enabled ? 'border-slate-100 shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                                    {!enabled && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                                                    {name}
                                                </h4>
                                                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{desc}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                                                <span className="text-[10px] font-black text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                                                    Total Alokasi: {formatIDR(levelBudgetSum)}
                                                </span>
                                                {!enabled && (
                                                    <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full">
                                                        🔒 Terkunci
                                                    </span>
                                                )}
                                                {enabled && level === 5 && (
                                                    <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                                                        ✨ Otomatis (Read-Only)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Category inputs */}
                                        <div className="divide-y divide-slate-50">
                                            {cats.length === 0 ? (
                                                <div className="text-xs font-medium text-slate-400 py-3">Tidak ada kategori di tingkat ini.</div>
                                            ) : (
                                                cats.map(cat => {
                                                    const IconComponent = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : Grid;
                                                    const draftVal = draftBudgets[cat.id];
                                                    const hasDiff = draftVal !== undefined && parseFloat(draftVal) !== cat.budget;

                                                    return (
                                                        <div key={cat.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cat.color ? cat.color.replace("-500", "-100") : "bg-slate-100"}`}>
                                                                    <IconComponent className={`w-4 h-4 ${cat.color ? cat.color.replace("bg-", "text-").replace("-500", "-600") : "text-slate-500"}`} />
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                                                                    {cat.parentId && (
                                                                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                                                            Sub dari: {categories.find(c => c.id === cat.parentId)?.name || 'Parent'}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                                                                <div className="relative flex-1 sm:flex-initial">
                                                                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                                                                    <input
                                                                        type="text"
                                                                        disabled={!enabled || level === 5 || !canAturBudget}
                                                                        placeholder="0"
                                                                        value={
                                                                            draftVal !== undefined
                                                                                ? formatNumberWithDots(draftVal)
                                                                                : (cat.budget !== undefined && cat.budget !== null && cat.budget !== ""
                                                                                    ? formatNumberWithDots(cat.budget)
                                                                                    : "0")
                                                                        }
                                                                        onChange={(e) => {
                                                                            const cleanVal = e.target.value.replace(/[^0-9]/g, "");
                                                                            setDraftBudgets(prev => ({
                                                                                ...prev,
                                                                                [cat.id]: cleanVal
                                                                            }));
                                                                        }}
                                                                        className="pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-100/50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all font-semibold w-full sm:w-44"
                                                                    />
                                                                </div>
                                                                {hasDiff && (
                                                                    <button
                                                                        onClick={() => handleSaveCategoryBudget(cat, draftVal)}
                                                                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100 active:scale-95 transition-all shrink-0"
                                                                    >
                                                                        Simpan
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            {/* Sub-tab 3: Fase Rekonsiliasi (Tutup Bulan) */}
            {budgetSubTab === "rekonsiliasi" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Close Month Actions Card */}
                        {!isIstri && (
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm md:col-span-1 space-y-4">
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Tutup Bulan & Snapshot</h3>
                                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Kunci anggaran bulan berjalan untuk evaluasi akurasi</p>
                                </div>

                                <div className="space-y-3 pt-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">Bulan untuk ditutup</label>
                                        <input 
                                            type="month"
                                            value={closeMonthValue}
                                            onChange={(e) => setCloseMonthValue(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                                        />
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Yakin ingin menutup bulan ${closeMonthValue}? Aksi ini akan menghitung deviasi realisasi spending dan menyimpan snapshot permanen.`)) {
                                                axios.post('/budget/close-month', { month: closeMonthValue })
                                                    .then(res => {
                                                        showToast(`Bulan ${closeMonthValue} berhasil ditutup!`);
                                                        fetchSnapshots();
                                                    })
                                                    .catch(err => {
                                                        const msg = err.response?.data?.message || "Gagal menutup bulan";
                                                        showToast(msg, "error");
                                                    });
                                            }
                                        }}
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10"
                                    >
                                        Proses Tutup Bulan
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Performance baseline card */}
                        <div className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between ${isIstri ? 'md:col-span-3' : 'md:col-span-2'}`}>
                            <div>
                                <h3 className="text-sm font-black tracking-tight text-blue-50">Baseline Rekomendasi Akurasi</h3>
                                <p className="text-[10px] text-blue-100 font-medium mt-1 leading-relaxed">
                                    Persentase akurasi anggaran bulan lalu digunakan sebagai acuan peramalan perencanaan anggaran bulan berikutnya agar target belanja realistis.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
                                <div>
                                    <span className="text-[9px] font-bold text-blue-200 uppercase">Baseline Rekomendasi</span>
                                    <div className="text-2xl font-black text-white mt-1">
                                        {snapshots.length > 0 ? `${snapshots[0].avg_accuracy}%` : 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-blue-200 uppercase">Terakhir Ditutup</span>
                                    <div className="text-sm font-black text-white mt-1">
                                        {snapshots.length > 0 ? snapshots[0].month : 'Belum ada'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Snapshots History list */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="text-sm font-black text-slate-800 tracking-tight">Histori Rekonsiliasi Bulanan</h3>
                            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Daftar snapshot akurasi anggaran dari bulan-bulan sebelumnya</p>
                        </div>

                        {loadingSnapshots ? (
                            <div className="text-center py-8 text-xs font-semibold text-slate-400 animate-pulse">Memuat histori snapshot...</div>
                        ) : snapshots.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                <p className="text-xs font-semibold text-slate-400">Belum ada bulan yang direkonsiliasi.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {snapshots.map((snap) => {
                                    const isExpanded = expandedSnapshotMonth === snap.month;
                                    return (
                                        <div key={snap.month} className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
                                            {/* Month Summary bar */}
                                            <div 
                                                onClick={() => setExpandedSnapshotMonth(isExpanded ? null : snap.month)}
                                                className="p-4 bg-slate-50/50 hover:bg-slate-50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black tracking-tight">{snap.month}</div>
                                                    <div>
                                                        <div className="text-xs font-black text-slate-700">Akurasi Rata-Rata: {snap.avg_accuracy}%</div>
                                                        <div className="text-[9px] font-bold text-slate-400 mt-0.5">Format: Selisih Anggaran vs Realisasi Belanja</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <span className="text-[9px] font-bold text-slate-400 block">Total Budget / Spent</span>
                                                        <span className="text-xs font-bold text-slate-700">{formatIDR(snap.total_budget)} / {formatIDR(snap.total_spent)}</span>
                                                    </div>
                                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>

                                            {/* Detail list collapse */}
                                            {isExpanded && (
                                                <div className="p-4 bg-white divide-y divide-slate-50 border-t border-slate-100">
                                                    {snap.items.map((item, idx) => (
                                                        <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                                                            <div className="font-semibold text-slate-600">{item.category_name}</div>
                                                            <div className="flex items-center gap-6 text-right">
                                                                <div>
                                                                    <span className="text-[9px] font-bold text-slate-400 block">Anggaran vs Realisasi</span>
                                                                    <span className="font-bold text-slate-700">{formatIDR(item.budget)} vs {formatIDR(item.spent)}</span>
                                                                </div>
                                                                <div className="w-16">
                                                                    <span className="text-[9px] font-bold text-slate-400 block">Akurasi</span>
                                                                    <span className={`font-black ${item.accuracy > 80 ? 'text-emerald-500' : item.accuracy > 50 ? 'text-amber-500' : 'text-rose-500'}`}>{item.accuracy.toFixed(0)}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
