import React, { useState, useEffect } from 'react';
import { 
    Wallet, TrendingUp, TrendingDown, PiggyBank, Activity, 
    ArrowUpRight, ArrowDownRight, Target, Calendar,
    Lightbulb, ShieldCheck, Home, Plane, GraduationCap, AlertCircle, 
    CheckCircle2, ChevronRight, ChevronDown, RefreshCw, AlertOctagon, Sparkles, AlertTriangle
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import MicroTrackerCard from './MicroTrackerCard';
import useExecutiveDashboard from '../Hooks/useExecutiveDashboard';

// Utils
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const SectionTitle = ({ title, subtitle, icon }) => (
    <div className="mb-6 flex items-center justify-between">
        <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {icon && <span className="text-blue-500">{icon}</span>}
                {title}
            </h2>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

export default function ExecutiveDashboard({ categories = [], transactions = [], currentUser }) {
    const isIstri = currentUser?.role === "Istri";
    const {
        data,
        loading,
        recaching,
        error,
        fetchMetrics
    } = useExecutiveDashboard(categories, transactions);

    const [isMicroBudgetOpen, setIsMicroBudgetOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <p className="text-slate-500 text-sm font-medium animate-pulse">Mengalkulasi metrik & memuat dashboard...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto my-12 shadow-sm">
                <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-800 mb-2">Terjadi Kesalahan</h3>
                <p className="text-red-600 text-sm mb-6">{error || 'Data gagal dimuat.'}</p>
                <button
                    onClick={() => fetchMetrics()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 mx-auto shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" /> Coba Lagi
                </button>
            </div>
        );
    }

    // Color mapper for pacing status
    const getPacingColors = (color) => {
        switch (color) {
            case 'green':
                return {
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    text: 'text-emerald-700',
                    badge: 'bg-emerald-500 text-white',
                    glow: 'shadow-emerald-100',
                    bar: 'bg-emerald-500'
                };
            case 'yellow':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    text: 'text-amber-700',
                    badge: 'bg-amber-500 text-white',
                    glow: 'shadow-amber-100',
                    bar: 'bg-amber-500'
                };
            case 'red':
            default:
                return {
                    bg: 'bg-rose-50',
                    border: 'border-rose-200',
                    text: 'text-rose-700',
                    badge: 'bg-rose-500 text-white',
                    glow: 'shadow-rose-100',
                    bar: 'bg-rose-500'
                };
        }
    };

    const pacing = getPacingColors(data.safe_to_spend.pacing_color);

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        Dashboard Analitik Eksekutif <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                    </h1>
                    <p className="text-sm text-slate-500">Proyeksi, anomali, & rekomendasi keuangan keluarga berbasis Z-Score dan EMA</p>
                </div>
                {!isIstri && (
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-mono hidden md:inline-block">
                            {data.safe_to_spend.calibration_text}
                        </span>
                        <button
                            onClick={() => fetchMetrics(true)}
                            disabled={recaching}
                            className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${recaching ? 'animate-spin' : ''}`} />
                            {recaching ? 'Merekalkulasi...' : 'Rencana Ulang / Sinkronkan'}
                        </button>
                    </div>
                )}
            </div>

            {/* Section 1: Financial Pacing and Liquidity Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Safe-to-Spend Pacing Card */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className={`bg-white rounded-2xl border-2 ${pacing.border} p-6 shadow-sm ${pacing.glow} shadow-md transition-all relative overflow-hidden flex flex-col justify-between`}
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-full -mr-8 -mt-8 pointer-events-none" />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pacing Anggaran Bulanan</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${pacing.badge}`}>
                                {data.safe_to_spend.pacing_status}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                            {formatCurrency(data.safe_to_spend.safe_to_spend_per_week)}
                            <span className="text-xs text-slate-400 font-normal"> /minggu</span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">
                            Sisa Anggaran Aman (*Safe-to-Spend*). Batas wajar belanja mingguan agar tidak over-budget.
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Sisa Anggaran Bulan Ini:</span>
                        <span className="font-bold text-slate-700">{formatCurrency(data.summary.income - data.summary.expense)}</span>
                    </div>
                </motion.div>

                {/* Runway & Burn Rate Card */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Combined Runway (Time-To-Zero)</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-100">
                                {Math.round(data.runway.runway_days)} Hari Tersisa
                            </span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                            {formatCurrency(data.runway.runway_weeks * (data.summary.expense / 4.33))}
                            <span className="text-xs text-slate-400 font-normal"> total likuiditas</span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-2">
                            {data.runway.runway_narrative}
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Pola Bakar Dana Mingguan:</span>
                        <span className="font-bold text-slate-700">~{formatCurrency(data.runway.runway_weeks > 0 ? (data.netWorth.total / data.runway.runway_weeks) : 0)} /mg</span>
                    </div>
                </motion.div>

                {/* Health & Saving Rate Card */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className={`bg-slate-900 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden`}
                >
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kesehatan Finansial</span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide ${data.financialHealth.bgColor} text-white`}>
                                {data.financialHealth.status}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-5xl font-black text-white">{data.financialHealth.score}</h3>
                            <span className="text-xs text-slate-400">/ 100 poin</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-3 font-medium">
                            Saving Rate Anda bulan ini berada di angka <span className="text-blue-400 font-bold">{data.summary.savingRate}%</span> dengan cashflow positif sebesar <span className="text-emerald-400 font-bold">{formatCurrency(data.summary.cashFlow)}</span>.
                        </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span>Status Finansial:</span>
                        <span className="font-bold text-white">Sangat Optimal</span>
                    </div>
                </motion.div>
            </div>

            {/* Micro-monitoring UI tracking card - Collapse Accordion */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                <button
                    onClick={() => setIsMicroBudgetOpen(!isMicroBudgetOpen)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 text-left transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-800">Pemantauan Micro-Budget Harian</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Analisis laju pengeluaran real-time berdasarkan laju sisa hari bulan berjalan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {data.micro_monitoring?.warning_categories?.length > 0 && (
                            <span className="text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">
                                {data.micro_monitoring.warning_categories.length} Kategori Kritis
                            </span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-slate-450 transition-transform duration-300 ${isMicroBudgetOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                <AnimatePresence initial={false}>
                    {isMicroBudgetOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="border-t border-slate-50 p-6 bg-slate-50/30">
                                <MicroTrackerCard 
                                    categories={categories} 
                                    transactions={transactions} 
                                    currentMonthProgress={data.micro_monitoring?.month_elapsed_percent || 0.5}
                                    warningCategories={data.micro_monitoring?.warning_categories || []}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Section 2: Anomalies & Recommendations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Anomaly Detection Alerts */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full">
                    <SectionTitle 
                        title="Deteksi Anomali Pengeluaran" 
                        subtitle="Peringatan pengeluaran kategori yang melampaui rata-rata Z-Score historis 3 bulan"
                        icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
                    />
                    <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {data.anomalies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                                <h4 className="text-sm font-bold text-slate-700">Tidak Ada Anomali</h4>
                                <p className="text-xs text-slate-500 mt-1 max-w-[280px]">Seluruh kategori pengeluaran minggu ini masih berada di batas deviasi historis wajar.</p>
                            </div>
                        ) : (
                            data.anomalies.map((alert, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx} 
                                    className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex gap-3 relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-rose-900">Anomali Terdeteksi: Kategori {alert.category_name}</h4>
                                        <p className="text-xs text-rose-700 leading-relaxed font-medium">
                                            {alert.message}
                                        </p>
                                        <div className="flex items-center gap-4 text-[10px] text-rose-600 font-bold uppercase tracking-wide bg-rose-100/50 px-2 py-1 rounded-md w-fit">
                                            <span>Deviasi: +{formatCurrency(alert.deviation)}</span>
                                            <span>Dampak Pokok: {alert.impact_percentage}%</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Prescriptive Recommendations */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full">
                    <SectionTitle 
                        title="Rekomendasi Aksi Preskriptif" 
                        subtitle="Maksimal 3 instruksi konkret berbasis logika optimasi anggaran keluarga"
                        icon={<Lightbulb className="w-5 h-5 text-amber-500" />}
                    />
                    <div className="flex-1 space-y-4 justify-between flex flex-col">
                        <div className="space-y-3">
                            {data.recommendations.map((rec, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={idx} 
                                    className={`p-4 rounded-xl border flex gap-3 items-start transition-all hover:scale-[1.01] ${
                                        rec.type === 'warning' ? 'bg-amber-50/50 border-amber-100' :
                                        rec.type === 'success' ? 'bg-emerald-50/50 border-emerald-100' :
                                        'bg-blue-50/50 border-blue-100'
                                    }`}
                                >
                                    <div className={`p-1.5 rounded-lg shrink-0 ${
                                        rec.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                        rec.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {rec.type === 'warning' ? <AlertTriangle className="w-4 h-4"/> : 
                                         rec.type === 'success' ? <PiggyBank className="w-4 h-4"/> : 
                                         <Calendar className="w-4 h-4"/>}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${
                                            rec.type === 'warning' ? 'text-amber-950' :
                                            rec.type === 'success' ? 'text-emerald-950' :
                                            'text-blue-950'
                                        }`}>{rec.title}</h4>
                                        <p className={`text-xs mt-1 leading-relaxed ${
                                            rec.type === 'warning' ? 'text-amber-800' :
                                            rec.type === 'success' ? 'text-emerald-800' :
                                            'text-blue-800'
                                        }`}>{rec.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Forecasting & Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dynamic Forecasting Table */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm lg:col-span-2 flex flex-col">
                    <SectionTitle 
                        title="Proyeksi Kebutuhan Pokok Bulan Depan" 
                        subtitle="Estimasi konsumsi dinamis menggunakan Exponential Moving Average (EMA)"
                        icon={<Target className="w-5 h-5 text-indigo-500" />}
                    />
                    <div className="overflow-x-auto -mx-6 px-6 flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <th className="pb-3 pt-2">Kategori Pokok</th>
                                    <th className="pb-3 pt-2">Budget Bulan Ini</th>
                                    <th className="pb-3 pt-2">Estimasi Bulan Depan</th>
                                    <th className="pb-3 pt-2 text-right">Sinyal Tren</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.forecasting.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 font-semibold text-slate-800 flex items-center gap-2">
                                            {item.category_name}
                                        </td>
                                        <td className="py-4 text-sm text-slate-600 font-medium">
                                            {formatCurrency(item.current_budget)}
                                        </td>
                                        <td className="py-4 text-sm text-slate-800 font-bold">
                                            {formatCurrency(item.projected_need)}
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
                                                ${item.trend_direction === 'up' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                                                  item.trend_direction === 'down' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                                  'bg-slate-50 text-slate-600 border border-slate-100'}
                                            `}>
                                                {item.trend_direction === 'up' ? <TrendingUp className="w-3 h-3"/> : 
                                                 item.trend_direction === 'down' ? <TrendingDown className="w-3 h-3"/> : null}
                                                {item.trend_percentage > 0 ? `+${item.trend_percentage}%` : `${item.trend_percentage}%`}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expense Composition Chart */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col">
                    <SectionTitle 
                        title="Komposisi Pengeluaran" 
                        subtitle="Distribusi kategori belanja bulan berjalan"
                        icon={<Activity className="w-5 h-5 text-emerald-500" />}
                    />
                    <div className="h-56 relative my-auto flex-1 flex items-center justify-center">
                        {data.expenseComposition.length === 0 ? (
                            <p className="text-xs text-slate-400">Tidak ada data belanja bulan ini.</p>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={data.expenseComposition} 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={65} 
                                            outerRadius={80} 
                                            paddingAngle={4} 
                                            dataKey="value"
                                        >
                                            {data.expenseComposition.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            formatter={(value) => formatCurrency(value)} 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.06)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Belanja</span>
                                    <span className="text-lg font-black text-slate-800 mt-1">{formatCurrency(data.summary.expense)}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-bold text-slate-600">
                        {data.expenseComposition.slice(0, 4).map(item => (
                            <div key={item.name} className="flex items-center truncate">
                                <div className="w-2.5 h-2.5 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="truncate">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Expense Trend */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
                    <SectionTitle 
                        title="Tren Pengeluaran Historis" 
                        subtitle="Pola pengeluaran bulanan keluarga dalam 6 bulan terakhir"
                        icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                    />
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.expenseTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                                <YAxis hide />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.06)' }}
                                    formatter={(value) => [formatCurrency(value), "Pengeluaran"]}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="expense" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorExpense)" 
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Budget vs Actual per Category */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <SectionTitle 
                            title="Budget vs Aktual" 
                            subtitle="Top 5 kategori pengeluaran teraktif"
                            icon={<Target className="w-5 h-5 text-indigo-500" />}
                        />
                        <div className="h-56 mt-4">
                            {data.budgetVsActual.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-12">Belum ada data anggaran.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.budgetVsActual} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }} barSize={12}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} width={70} />
                                        <RechartsTooltip 
                                            cursor={{fill: 'transparent'}}
                                            formatter={(value) => formatCurrency(value)}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.06)' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} />
                                        <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="actual" name="Aktual" radius={[0, 4, 4, 0]}>
                                            {data.budgetVsActual.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.actual > entry.budget ? '#f43f5e' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
