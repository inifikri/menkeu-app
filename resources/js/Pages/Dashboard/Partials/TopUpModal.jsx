import React from 'react';
import { X, Check } from 'lucide-react';

export default function TopUpModal({
    isOpen,
    onClose,
    topUpData,
    setTopUpData,
    onSubmit,
    wallets,
    currentUser,
    formatIDR
}) {
    if (!isOpen) return null;

    const targetWallet = wallets.find(w => w.id === topUpData.walletId);
    const isTargetUtama = targetWallet?.isUtama;

    const availableSources = wallets
        .filter(w => w.id !== topUpData.walletId)
        .filter(w => {
            const ownerRole = w.user?.role;
            
            // Suami tidak bisa ambil dana dari kantong Istri
            if (currentUser.role === 'Suami') {
                const isOwnerIstri = ownerRole?.toLowerCase() === 'istri' || w.name.toLowerCase().includes('istri') || w.name.toLowerCase().includes('ibu');
                if (isOwnerIstri) return false;
            }

            // Istri tidak bisa ambil dana dari kantong Suami
            if (currentUser.role === 'Istri') {
                const isOwnerSuami = ownerRole?.toLowerCase() === 'suami' || w.name.toLowerCase().includes('suami') || w.name.toLowerCase().includes('bapak') || w.name.toLowerCase().includes('ayah');
                if (isOwnerSuami) return false;
            }

            return true;
        });

    const canSubmit = isTargetUtama ? true : !!topUpData.sourceWalletId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto w-full h-full min-h-screen">
            <div className="fixed inset-0 w-full h-full bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scaleUp z-10 border border-slate-100/50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Top Up Kantong</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    {!isTargetUtama && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Ambil Uang Dari Kantong</label>
                                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                    {availableSources.map(sw => {
                                        const isSelected = topUpData.sourceWalletId === sw.id;
                                        return (
                                            <button
                                                key={sw.id}
                                                type="button"
                                                onClick={() => setTopUpData({ ...topUpData, sourceWalletId: sw.id })}
                                                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                                                    isSelected 
                                                        ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/30' 
                                                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                                                }`}
                                            >
                                                <div>
                                                    <p className="font-bold text-xs text-slate-800 leading-tight">{sw.name}</p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">Saldo: {formatIDR(sw.balance)}</p>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white animate-scaleUp">
                                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nominal Top Up</label>
                        <input
                            type="text"
                            value={topUpData.amount ? `Rp ${parseInt(topUpData.amount.toString().replace(/[^0-9]/g, "") || 0).toLocaleString('id-ID')}` : ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                setTopUpData({ ...topUpData, amount: val });
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 text-sm font-semibold"
                            placeholder="Rp 0"
                            required
                            disabled={!canSubmit}
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200">Batal</button>
                        <button type="submit" disabled={!canSubmit} className={`flex-1 py-2.5 text-white font-bold text-sm rounded-xl shadow-md ${canSubmit ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-300 cursor-not-allowed shadow-none'}`}>Top Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
