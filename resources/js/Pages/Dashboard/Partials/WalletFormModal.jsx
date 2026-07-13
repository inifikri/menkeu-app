import React from 'react';
import { X } from 'lucide-react';

export default function WalletFormModal({
    isOpen,
    onClose,
    newWallet,
    setNewWallet,
    onSubmit
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto w-full h-full min-h-screen">
            <div className="fixed inset-0 w-full h-full bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp z-10 border border-slate-100/50">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">{newWallet.id ? "Edit Kantong" : "Tambah Kantong"}</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Nama Kantong</label>
                            <input 
                                type="text" 
                                value={newWallet.name} 
                                onChange={(e) => setNewWallet({...newWallet, name: e.target.value})} 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                placeholder="Contoh: BCA Ayah" 
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Tipe Kantong</label>
                                <select 
                                    value={newWallet.type} 
                                    onChange={(e) => setNewWallet({...newWallet, type: e.target.value})} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all"
                                >
                                    <option value="Bank">Bank</option>
                                    <option value="E-Wallet">E-Wallet</option>
                                    <option value="Tunai">Tunai</option>
                                    <option value="Investasi">Investasi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Ikon</label>
                                <select 
                                    value={newWallet.icon || "Wallet"} 
                                    onChange={(e) => setNewWallet({...newWallet, icon: e.target.value})} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all"
                                >
                                    <option value="Wallet">Dompet</option>
                                    <option value="CreditCard">Kartu Kredit</option>
                                    <option value="Building">Bank</option>
                                    <option value="Smartphone">HP (E-Wallet)</option>
                                    <option value="Coins">Koin</option>
                                </select>
                            </div>
                        </div>
                        {newWallet.id && !newWallet.is_utama && (
                            <div className="flex items-center gap-2 pt-1 pb-1">
                                <input
                                    type="checkbox"
                                    id="is_utama"
                                    checked={!!newWallet.is_utama}
                                    onChange={(e) => setNewWallet({...newWallet, is_utama: e.target.checked})}
                                    className="h-4 w-4 rounded border-slate-350 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="is_utama" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                                    Jadikan Dompet Utama (Sumber Dana Top Up)
                                </label>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">Warna Kantong</label>
                            <div className="flex flex-wrap gap-2">
                                {['bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500', 'bg-purple-600', 'bg-indigo-600', 'bg-cyan-600', 'bg-slate-800'].map(c => (
                                    <button 
                                        key={c} 
                                        type="button" 
                                        onClick={() => setNewWallet({...newWallet, color: c})} 
                                        className={`w-8 h-8 rounded-full ${c} ${newWallet.color === c ? 'ring-2 ring-offset-2 ring-blue-500 shadow-md scale-110' : 'opacity-80 hover:opacity-100 hover:scale-110'} transition-all`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
