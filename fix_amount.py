import sys
import re

filename = "resources/js/Pages/Dashboard.jsx"
with open(filename, "r") as f:
    content = f.read()

old_input = """                                            <input
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

new_input = """                                            <input
                                                type="text"
                                                value={`Rp ${parseInt(editingTx.amount.toString().replace(/[^0-9]/g, "") || 0).toLocaleString('id-ID')}`}
                                                disabled
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-100 cursor-not-allowed text-slate-500"
                                            />"""

content = content.replace(old_input, new_input)

with open(filename, "w") as f:
    f.write(content)
print("Done")
