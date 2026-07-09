import sys

filename = "resources/js/Pages/Dashboard.jsx"
with open(filename, "r") as f:
    content = f.read()

old_actions = """                                                                        <div className="flex items-center gap-4">
                                                                            <div className="flex items-center gap-1.5">
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
                                                                        </div>"""

new_actions = """                                                                        <div className="flex items-center gap-4">
                                                                            <div className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                                {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5">
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
                                                                        </div>"""

if old_actions in content:
    content = content.replace(old_actions, new_actions)
    with open(filename, "w") as f:
        f.write(content)
    print("Reordered actions successfully.")
else:
    print("Could not find the block. I will try a looser regex replacement.")
