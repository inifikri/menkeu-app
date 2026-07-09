import sys
import re

filename = "resources/js/Pages/Dashboard.jsx"
with open(filename, "r") as f:
    content = f.read()

# 1. Menu kantong pada tampilan mobile
# Search for {hasPermission("kelola_dompet") && ( and setActiveTab("dompet")
content = content.replace('{hasPermission("kelola_dompet") && (\n                                    <button\n                                        onClick={() => {\n                                            setActiveTab("dompet");',
'{(hasPermission("kelola_dompet") || hasPermission("lihat_dompet")) && (\n                                    <button\n                                        onClick={() => {\n                                            setActiveTab("dompet");')


# 2. Form top up: format rupiah
# We find the Top Up Modal input
topup_modal_input_old = """<input
                                    type="number"
                                    value={topUpData.amount}
                                    onChange={(e) => setTopUpData({ ...topUpData, amount: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                                    placeholder="Contoh: 500000"
                                    required
                                />"""
topup_modal_input_new = """<input
                                    type="text"
                                    value={topUpData.amount ? `Rp ${parseInt(topUpData.amount.toString().replace(/[^0-9]/g, "") || 0).toLocaleString('id-ID')}` : ""}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        setTopUpData({ ...topUpData, amount: val });
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                                    placeholder="Rp 0"
                                    required
                                />"""
content = content.replace(topup_modal_input_old, topup_modal_input_new)


# 4. Untuk riwayat pemasukan tidak perlu menggunakan kategori
# We need to change the rendering in the dompet tab
# Let's find:
# const cat = categories.find(c => c.id == t.categoryId);
# const wal = wallets.find(w => w.id == t.walletId);
dompet_tx_render_old = """                                                                const cat = categories.find(c => c.id == t.categoryId);
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
                                                                        </div>"""

dompet_tx_render_new = """                                                                const cat = categories.find(c => c.id == t.categoryId);
                                                                const wal = wallets.find(w => w.id == t.walletId);
                                                                const isIncome = t.type === 'income';
                                                                return (
                                                                    <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-200 transition-colors group">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${isIncome ? 'bg-emerald-500' : (cat?.color || 'bg-slate-400')}`}>
                                                                                <div className="text-xs font-bold">{isIncome ? '+' : (cat?.name?.charAt(0) || '?')}</div>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-bold text-sm text-slate-900">{t.description}</h5>
                                                                                <p className="text-[10px] font-bold text-slate-500">{isIncome ? 'Pemasukan' : (cat?.name || 'Tanpa Kategori')} • {wal?.name || 'Tanpa Dompet'}</p>
                                                                            </div>
                                                                        </div>"""
content = content.replace(dompet_tx_render_old, dompet_tx_render_new)


# 5. Pada action delete tampilkan pesan apakah anda yakin dahulu
delete_old = """    const handleDeleteTransaction = (id, type, amount, walletId) => {
        const txToDelete = transactions.find(t => t.id === id);"""
delete_new = """    const handleDeleteTransaction = (id, type, amount, walletId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
        const txToDelete = transactions.find(t => t.id === id);"""
content = content.replace(delete_old, delete_new)


# 6. Action edit tidak untuk nominal, field nominal di disable
edit_amount_old = """                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                                Nominal (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                value={editingTx.amount}
                                                onChange={(e) =>
                                                    setEditingTx({
                                                        ...editingTx,
                                                        amount: e.target
                                                            .value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                                            />"""
edit_amount_new = """                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                                Nominal (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                value={editingTx.amount}
                                                disabled
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                            />"""
content = content.replace(edit_amount_old, edit_amount_new)

with open(filename, "w") as f:
    f.write(content)

print("Fixes applied successfully")
