import sys
import re

filename = "resources/js/Pages/Dashboard.jsx"
with open(filename, "r") as f:
    content = f.read()

# 1. Add state variables
state_vars = """
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [topUpData, setTopUpData] = useState({ walletId: '', amount: '' });
    const [walletTxPage, setWalletTxPage] = useState(1);
"""
if "showTopUpModal" not in content:
    content = content.replace('const [editingTx, setEditingTx] = useState(null);', 'const [editingTx, setEditingTx] = useState(null);\n' + state_vars)

# 2. Add handleTopUpSubmit
top_up_handler = """
    const handleTopUpSubmit = (e) => {
        e.preventDefault();
        if (!topUpData.amount || isNaN(topUpData.amount) || parseFloat(topUpData.amount) <= 0) {
            showToast("Nominal top up tidak valid", "error");
            return;
        }
        const amountNum = parseFloat(topUpData.amount);
        const newTx = {
            id: "t_" + Date.now(),
            description: "Top Up Kantong",
            amount: amountNum,
            type: "income",
            categoryId: categories[0]?.id || "c1",
            walletId: topUpData.walletId,
            memberId: currentUser?.id || members[0]?.id || "m1",
            date: new Date().toISOString().split("T")[0],
        };
        
        setWallets(prev => prev.map(w => w.id === topUpData.walletId ? { ...w, balance: w.balance + amountNum } : w));
        setTransactions(prev => [newTx, ...prev]);
        showToast("Top up berhasil!", "success");
        logActivity('Top Up Dompet', `Top up kantong senilai Rp ${formatIDR(amountNum)}`, 'Tambah', 'bg-emerald-500');
        setShowTopUpModal(false);
    };
"""
if "handleTopUpSubmit" not in content:
    content = content.replace('const handleSaveBulkTransactions = (e) => {', top_up_handler + '\n    const handleSaveBulkTransactions = (e) => {')

# 3. Modify wallet rendering (remove hover top up, add explicit top up button)
# We will use regex to find the map(w => { ... }) part.
old_wallet_map_start = """                                {wallets.map((w) => {"""
old_wallet_map_end = """                                        </div>
                                    )
                                })}"""

import re
wallet_list_pattern = re.compile(r'\{wallets\.map\(\(w\) => \{.*?\n\s*\)\n\s*\}\)\}', re.DOTALL)

new_wallet_list = """{wallets.map((w) => {
                                    const isWalletIstri = w.name.toLowerCase().includes('istri') || w.name.toLowerCase().includes('ibu');
                                    const canTopUp = hasPermission("topup_dompet") && !(currentUser?.role?.toLowerCase() === 'suami' && isWalletIstri);

                                    return (
                                        <div key={w.id} className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
                                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${w.color || "bg-blue-600"}`}></div>
                                            <div className="flex items-start justify-between mb-2 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${w.color || "bg-blue-600"}`}>
                                                        {w.icon === 'Wallet' && <Wallet className="w-5 h-5" />}
                                                        {w.icon === 'CreditCard' && <CreditCard className="w-5 h-5" />}
                                                        {w.icon === 'Building' && <Building className="w-5 h-5" />}
                                                        {w.icon === 'Smartphone' && <Smartphone className="w-5 h-5" />}
                                                        {w.icon === 'Coins' && <Coins className="w-5 h-5" />}
                                                        {!['Wallet','CreditCard','Building','Smartphone','Coins'].includes(w.icon) && <Wallet className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 leading-tight">{w.name}</h4>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{w.type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {hasPermission("kelola_dompet") && (
                                                        <>
                                                            <button onClick={() => { setNewWallet(w); setShowAddWalletModal(true); }} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                                                            <button onClick={() => handleDeleteWallet(w.id)} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-end justify-between mt-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Total Saldo</p>
                                                    <p className="text-xl font-black text-slate-900 tracking-tight">{formatIDR(w.balance)}</p>
                                                </div>
                                                {canTopUp && (
                                                    <button 
                                                        onClick={() => {
                                                            setTopUpData({ walletId: w.id, amount: '' });
                                                            setShowTopUpModal(true);
                                                        }} 
                                                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" /> Top Up
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}"""

content = wallet_list_pattern.sub(new_wallet_list, content)

# 4. Modify Transaction Section in dompet
tx_section_pattern = re.compile(r'\{Object\.entries\(\s*transactions.*?\)\s*\}\)\s*\}', re.DOTALL)

# Wait, let's just replace the whole space-y-6 inside Transaksi Section
# we need to find <div className="space-y-6"> after {/* Transaksi Section */} and replace until the closing div
start_marker = '<div className="space-y-6">'
end_marker = '</div>\n                            </div>\n                        </div>\n                    )}'

idx_start = content.find('                                <div className="space-y-6">', content.find('{/* Transaksi Section */}'))
idx_end = content.find('</div>\n                            </div>\n                        </div>\n                    )}', idx_start)

if idx_start != -1 and idx_end != -1:
    new_tx_section = """<div className="space-y-6">
                                    {(() => {
                                        const walletTxPerPage = 15;
                                        const filteredWalletTxs = transactions
                                            .filter(t => {
                                                const d = new Date(t.date);
                                                return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
                                            })
                                            .filter(t => (walletSearch ? t.description.toLowerCase().includes(walletSearch.toLowerCase()) : true))
                                            .filter(t => (walletCategoryFilter !== "all" ? t.categoryId == walletCategoryFilter : true))
                                            .sort((a, b) => new Date(b.date) - new Date(a.date));

                                        const totalWalletPages = Math.ceil(filteredWalletTxs.length / walletTxPerPage) || 1;
                                        // Pastikan current page tidak melebihi total
                                        const currentPg = Math.min(walletTxPage, totalWalletPages);
                                        const paginatedWalletTxs = filteredWalletTxs.slice((currentPg - 1) * walletTxPerPage, currentPg * walletTxPerPage);
                                        
                                        if (filteredWalletTxs.length === 0) {
                                            return (
                                                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                                                    <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                                    <p className="text-slate-500 font-bold">Tidak ada transaksi yang cocok di bulan ini.</p>
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
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                                                        <div className="space-y-2">
                                                            {txs.map(t => {
                                                                const cat = categories.find(c => c.id == t.categoryId);
                                                                const wal = wallets.find(w => w.id == t.walletId);
                                                                return (
                                                                    <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-200 transition-colors group">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${cat?.color || 'bg-slate-400'}`}>
                                                                                <div className="text-xs font-bold">{cat?.name?.charAt(0) || '?'}</div>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-bold text-sm text-slate-900">{t.description}</h5>
                                                                                <p className="text-[10px] font-bold text-slate-500">{cat?.name || 'Tanpa Kategori'} • {wal?.name || 'Tanpa Dompet'}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <button
                                                                                    onClick={() => handleOpenEdit(t)}
                                                                                    className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                                                                                    title="Ubah Transaksi"
                                                                                >
                                                                                    <Edit className="w-3.5 h-3.5" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteTransaction(t.id, t.type, t.amount, t.walletId)}
                                                                                    className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                                                                                    title="Hapus Transaksi"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                            <div className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                                {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Pagination Controls */}
                                                {totalWalletPages > 1 && (
                                                    <div className="flex items-center justify-center pt-6 gap-2">
                                                        <button
                                                            onClick={() => setWalletTxPage(p => Math.max(1, p - 1))}
                                                            disabled={currentPg === 1}
                                                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 shadow-sm"
                                                        >
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <div className="flex gap-1.5">
                                                            {Array.from({ length: totalWalletPages }, (_, i) => i + 1).map(pageNum => (
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
                                                            onClick={() => setWalletTxPage(p => Math.min(totalWalletPages, p + 1))}
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
                                </div>"""
    content = content[:idx_start] + new_tx_section + content[idx_end:]


# 5. Add Top Up Modal at the very end
top_up_modal = """
            {/* MODAL TOP UP */}
            {showTopUpModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-150 max-w-sm w-full p-6 shadow-xl animate-scaleUp">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h3 className="font-bold text-slate-900 text-base">Top Up Kantong</h3>
                            <button onClick={() => setShowTopUpModal(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleTopUpSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nominal Top Up</label>
                                <input
                                    type="number"
                                    value={topUpData.amount}
                                    onChange={(e) => setTopUpData({ ...topUpData, amount: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                                    placeholder="Contoh: 500000"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowTopUpModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200">Batal</button>
                                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200">Top Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
"""

if "MODAL TOP UP" not in content:
    # insert before the final closing </div> of the main component which is at the end of file
    idx = content.rfind('        </div>\n    );\n}')
    if idx != -1:
        content = content[:idx] + top_up_modal + content[idx:]

with open(filename, "w") as f:
    f.write(content)

print("Done")
