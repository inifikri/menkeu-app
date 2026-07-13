import React from 'react';
import { X, Check } from 'lucide-react';

export default function TransferModal({
    isOpen,
    onClose,
    transferData,
    setTransferData,
    onSubmit,
    wallets,
    members = [],
    currentUser,
    formatIDR
}) {
    if (!isOpen) return null;

    const sourceWallet = wallets.find(w => w.id === transferData.sourceWalletId);
    
    // Dapatkan anggota keluarga lain (selain diri sendiri) yang memiliki Dompet Utama
    const otherMembers = members
        .filter(m => m.id !== currentUser?.id)
        .map(member => {
            const dompetUtama = wallets.find(w => w.userId == member.id && w.isUtama);
            if (!dompetUtama) return null;
            return {
                id: dompetUtama.id,
                type: 'member',
                name: member.name,
                subText: `Kirim ke Dompet Utama (${member.role})`
            };
        })
        .filter(Boolean);

    // Dapatkan kantong pribadi milik diri sendiri (selain kantong asal)
    const personalWallets = wallets
        .filter(w => w.userId == currentUser?.id && w.id !== transferData.sourceWalletId)
        .filter(w => {
            // Dompet Utama pribadi hanya muncul sebagai tujuan jika asal transfer bukan Dompet Utama
            if (w.isUtama) {
                return !sourceWallet?.isUtama;
            }
            return true;
        })
        .map(w => ({
            id: w.id,
            type: 'personal_wallet',
            name: w.isUtama ? "Dompet Utama Pribadi" : w.name,
            subText: w.isUtama ? "Kembalikan saldo utama" : `Kantong Cabang Pribadi (${w.type})`
        }));

    // Gabungkan opsi target transfer
    const targetOptions = [...otherMembers, ...personalWallets];
    const canSubmit = !!sourceWallet && !!transferData.targetWalletId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto w-full h-full min-h-screen">
            <div className="fixed inset-0 w-full h-full bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scaleUp z-10 border border-slate-100/50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Pindahkan Uang</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Kantong Asal info hidden */}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Tujuan</label>
                        <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                            {targetOptions.map(opt => {
                                const isSelected = transferData.targetWalletId === opt.id;
                                return (
                                    <button
                                        key={`${opt.type}-${opt.id}`}
                                        type="button"
                                        onClick={() => setTransferData({ ...transferData, targetWalletId: opt.id })}
                                        className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                                            isSelected 
                                                ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/30' 
                                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-bold text-xs text-slate-800 leading-tight">{opt.name}</p>
                                            <p className="text-[9px] text-slate-550 mt-0.5 font-bold">{opt.subText}</p>
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

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nominal Pemindahan</label>
                        <input
                            type="text"
                            value={transferData.amount ? `Rp ${parseInt(transferData.amount.toString().replace(/[^0-9]/g, "") || 0).toLocaleString('id-ID')}` : ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                setTransferData({ ...transferData, amount: val });
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 text-sm font-semibold"
                            placeholder="Rp 0"
                            required
                            disabled={!canSubmit}
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200">Batal</button>
                        <button type="submit" disabled={!canSubmit} className={`flex-1 py-2.5 text-white font-bold text-sm rounded-xl shadow-md ${canSubmit ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-slate-300 cursor-not-allowed shadow-none'}`}>Pindahkan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
