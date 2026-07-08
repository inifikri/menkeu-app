import re

with open('resources/js/Pages/Dashboard.jsx', 'r') as f:
    content = f.read()

# 1. Update handleAddWallet and add handleDeleteWallet
handle_add_wallet_new = """
    const handleDeleteWallet = (id) => {
        if (window.confirm("Yakin ingin menghapus kantong ini?")) {
            const walletToDel = wallets.find(w => w.id === id);
            
            if (typeof id === 'string' && id.startsWith('w_')) {
                setWallets(wallets.filter((w) => w.id !== id));
                showToast("Kantong berhasil dihapus", "info");
                logActivity('Hapus Kantong', `Kantong dihapus: ${walletToDel?.name}`, 'Trash2', 'bg-rose-500');
                return;
            }

            router.delete(`/wallets/${id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    showToast("Kantong berhasil dihapus", "info");
                    logActivity('Hapus Kantong', `Kantong dihapus: ${walletToDel?.name}`, 'Trash2', 'bg-rose-500');
                },
                onError: (errors) => {
                    showToast("Gagal menghapus kantong", "error");
                }
            });
        }
    };

    const handleAddWallet = (e) => {
        e.preventDefault();
        if (!newWallet.name || !newWallet.balance) {
            showToast("Nama dompet dan saldo awal wajib diisi", "error");
            return;
        }

        const payload = {
            ...newWallet,
            balance: parseFloat(newWallet.balance) || 0,
        };

        if (newWallet.id && typeof newWallet.id === "number") {
            router.put(`/wallets/${newWallet.id}`, payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowAddWalletModal(false);
                    showToast("Kantong berhasil diperbarui");
                },
                onError: (errors) => {
                    showToast("Gagal memperbarui kantong", "error");
                }
            });
        } else if (newWallet.id && typeof newWallet.id === "string" && newWallet.id.startsWith("w_")) {
            setWallets(wallets.map(w => w.id === newWallet.id ? { ...w, ...payload } : w));
            setShowAddWalletModal(false);
            showToast("Kantong berhasil diperbarui");
        } else {
            router.post('/wallets', payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowAddWalletModal(false);
                    showToast("Kantong baru berhasil didaftarkan");
                },
                onError: (errors) => {
                    showToast("Gagal menambahkan kantong", "error");
                }
            });
        }
    };
"""

# replace handleAddWallet block
import re
content = re.sub(
    r"    const handleAddWallet = \(e\) => \{.*?(?=    const handleAddMember = \(e\) => \{)",
    handle_add_wallet_new + "\n",
    content,
    flags=re.DOTALL
)

# 2. Add wallet state variables near line 470
# Already done by previous tool call! I will just ensure walletSearch and walletCategoryFilter are defined.
if "const [walletSearch" not in content:
    content = content.replace("const [showAddWalletModal, setShowAddWalletModal] = useState(false);", 
        "const [showAddWalletModal, setShowAddWalletModal] = useState(false);\n    const [walletSearch, setWalletSearch] = useState(\"\");\n    const [walletCategoryFilter, setWalletCategoryFilter] = useState(\"all\");")

# 3. Add imports if needed (Building, Smartphone, Coins)
if "Coins" not in content:
    content = content.replace("CreditCard,", "CreditCard, Building, Smartphone, Coins,")

# 4. Replace DOMPET Tab UI
dompet_ui_new = """                    {/* TAB 4: DOMPET & AKUN */}
                    {activeTab === "dompet" && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Kantong Keuangan</h3>
                                    <p className="text-xs text-slate-500">Kelola rekening, e-wallet, dan uang tunai Anda</p>
                                </div>
                                {hasPermission("kelola_dompet") && (
                                    <button
                                        onClick={() => {
                                            setNewWallet({ id: null, name: "", balance: "", type: "Bank", color: "bg-blue-600", icon: "Wallet" });
                                            setShowAddWalletModal(true);
                                        }}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Tambah Kantong
                                    </button>
                                )}
                            </div>

                            {/* List Kantong */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {wallets.map((w) => {
                                    return (
                                        <div key={w.id} className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
                                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${w.color || "bg-blue-600"}`}></div>
                                            <div className="flex items-start justify-between mb-4 relative z-10">
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
                                                {hasPermission("kelola_dompet") && (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setNewWallet(w); setShowAddWalletModal(true); }} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => handleDeleteWallet(w.id)} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-xs text-slate-500 mb-1">Total Saldo</p>
                                                <p className="text-xl font-black text-slate-900 tracking-tight">{formatIDR(w.balance)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Transaksi Section */}
                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-4">Riwayat Transaksi</h3>
                                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="text" value={walletSearch} onChange={(e) => setWalletSearch(e.target.value)} placeholder="Cari deskripsi transaksi..." className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm" />
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <select value={walletCategoryFilter} onChange={(e) => setWalletCategoryFilter(e.target.value)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm">
                                            <option value="all">Semua Kategori</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {Object.entries(
                                        transactions
                                            .filter(t => (walletSearch ? t.description.toLowerCase().includes(walletSearch.toLowerCase()) : true))
                                            .filter(t => (walletCategoryFilter !== "all" ? t.categoryId == walletCategoryFilter : true))
                                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                                            .reduce((groups, t) => {
                                                const date = t.date;
                                                if (!groups[date]) groups[date] = [];
                                                groups[date].push(t);
                                                return groups;
                                            }, {})
                                    ).map(([date, txs]) => (
                                        <div key={date}>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                                            <div className="space-y-2">
                                                {txs.map(t => {
                                                    const cat = categories.find(c => c.id == t.categoryId);
                                                    const wal = wallets.find(w => w.id == t.walletId);
                                                    return (
                                                        <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-200 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${cat?.color || 'bg-slate-400'}`}>
                                                                    <div className="text-xs font-bold">{cat?.name?.charAt(0) || '?'}</div>
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-bold text-sm text-slate-900">{t.description}</h5>
                                                                    <p className="text-[10px] font-bold text-slate-500">{cat?.name || 'Tanpa Kategori'} • {wal?.name || 'Tanpa Dompet'}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {transactions.filter(t => (walletSearch ? t.description.toLowerCase().includes(walletSearch.toLowerCase()) : true)).filter(t => (walletCategoryFilter !== "all" ? t.categoryId == walletCategoryFilter : true)).length === 0 && (
                                        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                                            <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500 font-bold">Tidak ada transaksi yang cocok.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}"""

content = re.sub(
    r"                    \{\/\* TAB 4: DOMPET & AKUN \*\/}.*?(?=                    \{\/\* TAB: PROFILE \*\/})",
    dompet_ui_new + "\n\n",
    content,
    flags=re.DOTALL
)

# 5. Inject wallet modal at the bottom near category modal
wallet_modal_ui = """            {/* MODAL TAMBAH / EDIT KANTONG */}
            {showAddWalletModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900">{newWallet.id ? "Edit Kantong" : "Tambah Kantong"}</h3>
                            <button onClick={() => setShowAddWalletModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAddWallet} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Nama Kantong</label>
                                    <input type="text" value={newWallet.name} onChange={(e) => setNewWallet({...newWallet, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Contoh: BCA Ayah" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Nominal Saldo Awal</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rp</span>
                                        <input type="text" value={newWallet.balance} onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setNewWallet({...newWallet, balance: val});
                                        }} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="0" required />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Otomatis terformat: {formatIDR(newWallet.balance || 0)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Tipe Kantong</label>
                                        <select value={newWallet.type} onChange={(e) => setNewWallet({...newWallet, type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all">
                                            <option value="Bank">Bank</option>
                                            <option value="E-Wallet">E-Wallet</option>
                                            <option value="Tunai">Tunai</option>
                                            <option value="Investasi">Investasi</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Ikon</label>
                                        <select value={newWallet.icon || "Wallet"} onChange={(e) => setNewWallet({...newWallet, icon: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all">
                                            <option value="Wallet">Dompet</option>
                                            <option value="CreditCard">Kartu Kredit</option>
                                            <option value="Building">Bank</option>
                                            <option value="Smartphone">HP (E-Wallet)</option>
                                            <option value="Coins">Koin</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">Warna Kantong</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500', 'bg-purple-600', 'bg-indigo-600', 'bg-cyan-600', 'bg-slate-800'].map(c => (
                                            <button key={c} type="button" onClick={() => setNewWallet({...newWallet, color: c})} className={`w-8 h-8 rounded-full ${c} ${newWallet.color === c ? 'ring-2 ring-offset-2 ring-blue-500 shadow-md scale-110' : 'opacity-80 hover:opacity-100 hover:scale-110'} transition-all`}></button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex gap-3">
                                    <button type="button" onClick={() => setShowAddWalletModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
"""

content = content.replace("            {/* Tombol Kembali Ke Atas */}", wallet_modal_ui + "\n            {/* Tombol Kembali Ke Atas */}")

with open('resources/js/Pages/Dashboard.jsx', 'w') as f:
    f.write(content)
