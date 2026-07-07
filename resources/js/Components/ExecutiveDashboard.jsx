import React from 'react';
import { 
    Wallet, TrendingUp, TrendingDown, PiggyBank, Activity, 
    ArrowUpRight, ArrowDownRight, Target, Calendar,
    Lightbulb, ShieldCheck, Home, Plane, GraduationCap, AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'framer-motion';

// Mock Data
const MOCK_DATA = {
    summary: {
        income: 25000000,
        expense: 15000000,
        cashFlow: 10000000,
        remainingBalance: 35000000,
        savingRate: 40,
        betterThanLastMonth: true
    },
    expenseComposition: [
        { name: 'Makan', value: 4500000, color: '#f97316' },
        { name: 'Transport', value: 2500000, color: '#3b82f6' },
        { name: 'Belanja', value: 3000000, color: '#ec4899' },
        { name: 'Cicilan', value: 3500000, color: '#ef4444' },
        { name: 'Investasi', value: 1500000, color: '#10b981' }
    ],
    expenseTrend: [
        { month: 'Jan', expense: 12000000 }, { month: 'Feb', expense: 11500000 },
        { month: 'Mar', expense: 13000000 }, { month: 'Apr', expense: 12500000 },
        { month: 'May', expense: 14000000 }, { month: 'Jun', expense: 15000000 },
        { month: 'Jul', expense: 13500000 }, { month: 'Aug', expense: 14500000 },
        { month: 'Sep', expense: 13000000 }, { month: 'Oct', expense: 12800000 },
        { month: 'Nov', expense: 15500000 }, { month: 'Dec', expense: 15000000 }
    ],
    budgetVsActual: [
        { category: 'Makan', budget: 4000000, actual: 4500000 },
        { category: 'Transport', budget: 3000000, actual: 2500000 },
        { category: 'Belanja', budget: 2500000, actual: 3000000 },
        { category: 'Hiburan', budget: 1500000, actual: 1200000 },
    ],
    topSpending: [
        { category: 'Makan', amount: 4500000, percentage: 30, trend: 'up', trendVal: 12 },
        { category: 'Cicilan', amount: 3500000, percentage: 23, trend: 'same', trendVal: 0 },
        { category: 'Belanja', amount: 3000000, percentage: 20, trend: 'up', trendVal: 15 },
        { category: 'Transport', amount: 2500000, percentage: 17, trend: 'down', trendVal: 8 },
    ],
    financialHealth: {
        score: 78,
        status: 'Good',
        color: 'text-green-500',
        bgColor: 'bg-green-500'
    },
    netWorth: {
        asset: 450000000,
        liability: 150000000,
        total: 300000000,
        trendData: [
            { month: 'Jan', value: 250000000 }, { month: 'Apr', value: 270000000 },
            { month: 'Jul', value: 285000000 }, { month: 'Oct', value: 300000000 }
        ]
    },
    financialGoals: [
        { name: 'Dana Darurat', current: 30000000, target: 60000000, icon: <ShieldCheck className="w-5 h-5"/>, color: 'bg-blue-500' },
        { name: 'DP Rumah', current: 150000000, target: 200000000, icon: <Home className="w-5 h-5"/>, color: 'bg-emerald-500' },
        { name: 'Liburan', current: 10000000, target: 25000000, icon: <Plane className="w-5 h-5"/>, color: 'bg-purple-500' },
        { name: 'Pendidikan Anak', current: 20000000, target: 100000000, icon: <GraduationCap className="w-5 h-5"/>, color: 'bg-orange-500' },
    ],
    upcomingBills: [
        { name: 'Listrik & Air', amount: 850000, date: '12 Jul', status: 'pending' },
        { name: 'Cicilan Mobil', amount: 3500000, date: '15 Jul', status: 'pending' },
        { name: 'Asuransi Kesehatan', amount: 1200000, date: '20 Jul', status: 'pending' },
    ],
    aiInsights: [
        { text: "Pengeluaran makan meningkat 12% dibanding bulan lalu. Pertimbangkan untuk lebih sering memasak di rumah.", type: 'warning' },
        { text: "Saving Rate Anda sangat sehat di angka 40%, pertahankan momentum ini!", type: 'success' },
        { text: "Budget Belanja telah over budget sebesar Rp 500.000.", type: 'alert' },
        { text: "Kategori transport mengalami penurunan sebesar 8%.", type: 'info' }
    ]
};

// Utils
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

// Components
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        {children}
    </div>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
);

export default function ExecutiveDashboard() {
    const data = MOCK_DATA;

    return (
        <div className="space-y-6 animate-fadeIn pb-12 font-sans">
            {/* Section 10: AI Insights - Placed at top for immediate actionability */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {data.aiInsights.map((insight, idx) => (
                    <div key={idx} className={`p-4 rounded-xl flex gap-3 text-sm border
                        ${insight.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-800' : 
                          insight.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 
                          insight.type === 'alert' ? 'bg-red-50 border-red-100 text-red-800' : 
                          'bg-blue-50 border-blue-100 text-blue-800'}
                    `}>
                        <div className="shrink-0 mt-0.5">
                            {insight.type === 'warning' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                            {insight.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {insight.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            {insight.type === 'info' && <Lightbulb className="w-4 h-4 text-blue-500" />}
                        </div>
                        <p className="leading-snug">{insight.text}</p>
                    </div>
                ))}
            </motion.div>

            {/* Section 1: Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowUpRight className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp className="w-5 h-5"/></div>
                        <h3 className="text-sm font-medium text-gray-500">Total Pemasukan</h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.summary.income)}</div>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowDownRight className="w-12 h-12 text-red-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingDown className="w-5 h-5"/></div>
                        <h3 className="text-sm font-medium text-gray-500">Total Pengeluaran</h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.summary.expense)}</div>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Wallet className="w-12 h-12 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Wallet className="w-5 h-5"/></div>
                        <h3 className="text-sm font-medium text-gray-500">Sisa Saldo</h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.summary.remainingBalance)}</div>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Activity className="w-12 h-12 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Activity className="w-5 h-5"/></div>
                        <h3 className="text-sm font-medium text-gray-500">Cash Flow</h3>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">+{formatCurrency(data.summary.cashFlow)}</div>
                </Card>

                <Card className="hover:shadow-md transition-shadow relative overflow-hidden group border-b-4 border-purple-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <PiggyBank className="w-12 h-12 text-purple-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><PiggyBank className="w-5 h-5"/></div>
                        <h3 className="text-sm font-medium text-gray-500">Saving Rate</h3>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold text-gray-900">{data.summary.savingRate}%</div>
                        <div className="text-sm text-green-500 flex items-center mb-1">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5%
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section 6 & 7: Financial Health & Net Worth */}
                <div className="flex flex-col gap-6">
                    <Card className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                        <SectionTitle title={<span className="text-white">Kesehatan Finansial</span>} />
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-5xl font-black">{data.financialHealth.score}</div>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold bg-green-400/20 text-green-300 border border-green-400/30`}>
                                Sehat
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-slate-300">
                            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Cash Flow Positif</span> <span>Lulus</span></div>
                            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Saving Rate {'>'} 20%</span> <span>Lulus</span></div>
                            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-400"/> Budget Disiplin</span> <span className="text-orange-300">Over</span></div>
                        </div>
                    </Card>

                    <Card className="flex-1">
                        <SectionTitle title="Net Worth" subtitle="Total kekayaan bersih" />
                        <div className="text-3xl font-bold text-gray-900 mb-6">{formatCurrency(data.netWorth.total)}</div>
                        <div className="h-32 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.netWorth.trendData}>
                                    <defs>
                                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorNetWorth)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-4">
                            <div><span className="text-gray-500 block mb-1">Aset</span><span className="font-semibold text-gray-800">{formatCurrency(data.netWorth.asset)}</span></div>
                            <div className="text-right"><span className="text-gray-500 block mb-1">Liabilitas</span><span className="font-semibold text-gray-800">{formatCurrency(data.netWorth.liability)}</span></div>
                        </div>
                    </Card>
                </div>

                {/* Section 3: Expense Trend */}
                <Card className="lg:col-span-2">
                    <SectionTitle title="Tren Pengeluaran" subtitle="12 Bulan Terakhir" />
                    <div className="h-72 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.expenseTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis hide domain={['dataMin - 1000000', 'dataMax + 1000000']} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [formatCurrency(value), "Pengeluaran"]}
                                />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section 2: Expense Composition */}
                <Card className="flex flex-col">
                    <SectionTitle title="Komposisi Pengeluaran" subtitle="Distribusi kategori bulan ini" />
                    <div className="h-56 relative my-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.expenseComposition} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {data.expenseComposition.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                            <span className="text-xs text-gray-500">Total</span>
                            <span className="text-lg font-bold text-gray-900">{formatCurrency(data.summary.expense)}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4">
                        {data.expenseComposition.map(item => (
                            <div key={item.name} className="flex items-center text-sm">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                <span className="text-gray-600 truncate">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Section 4: Budget vs Actual */}
                <Card className="lg:col-span-2">
                    <SectionTitle title="Budget vs Aktual" subtitle="Pemantauan anggaran per kategori" />
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.budgetVsActual} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }} barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13}} width={80} />
                                <RechartsTooltip 
                                    cursor={{fill: 'transparent'}}
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="actual" name="Aktual" radius={[0, 4, 4, 0]}>
                                    {data.budgetVsActual.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.actual > entry.budget ? '#ef4444' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section 5: Top Spending Category */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <SectionTitle title="Pengeluaran Terbesar" subtitle="Rincian per kategori" />
                    <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3 pt-2">Kategori</th>
                                    <th className="pb-3 pt-2">Nominal</th>
                                    <th className="pb-3 pt-2">% Total</th>
                                    <th className="pb-3 pt-2 text-right">Tren (Bulan Lalu)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.topSpending.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 font-medium text-gray-800">{item.category}</td>
                                        <td className="py-4 font-semibold text-gray-900">{formatCurrency(item.amount)}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                                <span className="text-sm text-gray-600">{item.percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`inline-flex items-center gap-1 text-sm font-medium
                                                ${item.trend === 'up' ? 'text-red-500' : item.trend === 'down' ? 'text-green-500' : 'text-gray-400'}
                                            `}>
                                                {item.trend === 'up' ? <TrendingUp className="w-4 h-4"/> : item.trend === 'down' ? <TrendingDown className="w-4 h-4"/> : '-'}
                                                {item.trendVal > 0 ? `${item.trendVal}%` : 'Sama'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="flex flex-col gap-6">
                    {/* Section 8: Financial Goals */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Target Keuangan</h2>
                                <p className="text-sm text-gray-500">Progres tujuan Anda</p>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                <Target className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-5">
                            {data.financialGoals.map((goal, idx) => {
                                const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                                return (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-md text-white ${goal.color}`}>
                                                    {goal.icon}
                                                </div>
                                                <span className="font-medium text-sm text-gray-800">{goal.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{percent}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-1">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full ${goal.color}`} 
                                            />
                                        </div>
                                        <div className="text-xs text-gray-400 flex justify-between">
                                            <span>{formatCurrency(goal.current)}</span>
                                            <span>{formatCurrency(goal.target)}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>

                    {/* Section 9: Upcoming Bills */}
                    <Card>
                        <SectionTitle title="Tagihan Mendatang" subtitle="Jangan sampai terlewat" />
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {data.upcomingBills.map((bill, idx) => (
                                <div key={idx} className="relative flex items-center justify-between group">
                                    <div className="flex items-center gap-4 relative">
                                        <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm z-10 group-hover:border-blue-500 transition-colors">
                                            <Calendar className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">{bill.name}</h4>
                                            <p className="text-xs text-gray-500">{bill.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900">{formatCurrency(bill.amount)}</div>
                                        <div className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full inline-block mt-1">Pending</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-5 py-2.5 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                            Lihat Semua Tagihan <ChevronRight className="w-4 h-4" />
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
