import React from "react";
import { AlertTriangle, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

// format number to IDR currency
const formatIDR = (num) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

export default function MicroTrackerCard({ categories, transactions, currentMonthProgress = 0.5, warningCategories = [] }) {
    const timeElapsedPercent = currentMonthProgress * 100;

    // 1. Filter child categories (which have parentId not null)
    const childCategories = categories.filter(c => c.parentId !== null && c.parentId !== undefined && c.parentId !== "");

    // 2. Calculate expenses for each child category in current month
    const childTrackers = childCategories.map(cat => {
        const spent = transactions
            .filter(t => t.categoryId === cat.id && t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        const budget = parseFloat(cat.budget) || 0;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;

        // Conditional coloring: Hijau (0% - 50%), Kuning (51% - 80%), Merah (>80%)
        let statusColor = "text-emerald-500";
        let barColor = "bg-emerald-500";
        let bgColor = "bg-emerald-500/10";
        let progressTheme = "emerald";

        if (percentage > 80) {
            statusColor = "text-rose-500";
            barColor = "bg-rose-500";
            bgColor = "bg-rose-500/10";
            progressTheme = "rose";
        } else if (percentage > 50) {
            statusColor = "text-amber-500";
            barColor = "bg-amber-500";
            bgColor = "bg-amber-500/10";
            progressTheme = "amber";
        }

        // System warning logic comparison:
        // Compare budget usage percentage with month elapsed progress percentage
        const isBurnRateExceeded = percentage > timeElapsedPercent && percentage > 0;

        return {
            ...cat,
            spent,
            budget,
            percentage,
            statusColor,
            barColor,
            bgColor,
            progressTheme,
            isBurnRateExceeded
        };
    });

    return (
        <div className="relative space-y-4">
            {/* List Tracker */}
            {childTrackers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-400 text-center px-4">
                        Belum ada sub-kategori yang terdaftar untuk pelacakan mikro.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {childTrackers.map(tracker => {
                        return (
                            <div key={tracker.id} className="group space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm bg-slate-50 text-slate-700 group-hover:scale-105 transition-transform`}>
                                            {tracker.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                                {tracker.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className={`text-[10px] font-black ${tracker.statusColor}`}>
                                                    {tracker.percentage.toFixed(0)}% Terpakai
                                                </span>
                                                {tracker.isBurnRateExceeded && (
                                                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.2 rounded-md">
                                                        <AlertTriangle className="w-2.5 h-2.5" />
                                                        Burn Rate Tinggi
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-slate-800">
                                            {formatIDR(tracker.spent)}
                                        </div>
                                        <div className="text-[9px] font-bold text-slate-400 mt-0.5">
                                            Limit: {formatIDR(tracker.budget)}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                    <div
                                        className={`h-full rounded-full ${tracker.barColor} transition-all duration-1000 ease-out`}
                                        style={{ width: `${Math.min(tracker.percentage, 100)}%` }}
                                    />
                                </div>

                                {/* Warning Notification Banner */}
                                {tracker.isBurnRateExceeded && (
                                    <div className="flex items-start gap-2 p-3 bg-rose-50/70 border border-rose-100 rounded-xl animate-fadeIn mt-2">
                                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-bold text-rose-600 leading-normal">
                                            Peringatan: Laju pemakaian anggaran <span className="font-extrabold">{tracker.name}</span> melebihi batas waktu operasional ({timeElapsedPercent.toFixed(0)}% bulan berjalan). Lakukan penyesuaian minggu ini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
