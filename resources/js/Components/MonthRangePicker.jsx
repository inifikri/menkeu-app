import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';

export default function MonthRangePicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const { startMonth, endMonth, year } = value || { 
        startMonth: new Date().getMonth() + 1, 
        endMonth: new Date().getMonth() + 1, 
        year: new Date().getFullYear() 
    };

    const MONTHS = [
        { id: 1, name: 'Januari', short: 'Jan' },
        { id: 2, name: 'Februari', short: 'Feb' },
        { id: 3, name: 'Maret', short: 'Mar' },
        { id: 4, name: 'April', short: 'Apr' },
        { id: 5, name: 'Mei', short: 'Mei' },
        { id: 6, name: 'Juni', short: 'Jun' },
        { id: 7, name: 'Juli', short: 'Jul' },
        { id: 8, name: 'Agustus', short: 'Agu' },
        { id: 9, name: 'September', short: 'Sep' },
        { id: 10, name: 'Oktober', short: 'Okt' },
        { id: 11, name: 'November', short: 'Nov' },
        { id: 12, name: 'Desember', short: 'Des' }
    ];

    // Tutup dropdown jika klik di luar komponen
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMonthClick = (monthId) => {
        // Jika start dan end sama (klik pertama kali atau reset)
        if (!endMonth || startMonth === endMonth) {
            if (monthId < startMonth) {
                // Jika klik bulan yang lebih awal, jadikan dia startMonth baru
                onChange({ startMonth: monthId, endMonth: monthId, year });
            } else {
                // Jadikan range dari startMonth ke monthId
                onChange({ startMonth, endMonth: monthId, year });
            }
        } else {
            // Klik baru setelah range terisi, jadikan startMonth baru
            onChange({ startMonth: monthId, endMonth: monthId, year });
        }
    };

    const handlePrevYear = () => {
        onChange({ startMonth, endMonth, year: year - 1 });
    };

    const handleNextYear = () => {
        onChange({ startMonth, endMonth, year: year + 1 });
    };

    // Label tombol trigger dropdown (contoh: "Mei - Juli 2026")
    const getPeriodLabel = () => {
        if (!endMonth || startMonth === endMonth) {
            return `${MONTHS[startMonth - 1].name} ${year}`;
        }
        return `${MONTHS[startMonth - 1].short} - ${MONTHS[endMonth - 1].short} ${year}`;
    };

    // Cek apakah bulan berada di dalam rentang pilihan
    const isSelected = (monthId) => {
        return monthId === startMonth || monthId === endMonth;
    };

    const isInRange = (monthId) => {
        if (!endMonth) return false;
        const min = Math.min(startMonth, endMonth);
        const max = Math.max(startMonth, endMonth);
        return monthId > min && monthId < max;
    };

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            {/* Tombol Pemicu Dropdown */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100 focus:outline-none"
            >
                <Calendar className="w-5 h-5 md:w-5 md:h-5" />
            </button>

            {/* Panel Dropdown - Desktop Popover */}
            {isOpen && (
                <div className="hidden md:block absolute right-0 mt-2.5 w-96 bg-white rounded-2xl border border-slate-150 shadow-xl z-[999] overflow-hidden animate-scaleUp p-5 space-y-4">
                    {/* Header Navigasi Tahun */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handlePrevYear}
                            className="p-1.5 hover:bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-black text-slate-800 tracking-tight">{year}</span>
                        <button
                            type="button"
                            onClick={handleNextYear}
                            className="p-1.5 hover:bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Grid Bulan */}
                    <div className="grid grid-cols-3 gap-3">
                        {MONTHS.map((m) => {
                            const selected = isSelected(m.id);
                            const inRange = isInRange(m.id);

                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => handleMonthClick(m.id)}
                                    className={`h-12 rounded-xl text-xs font-bold transition-all duration-200 relative flex items-center justify-center
                                        ${selected 
                                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-100 hover:bg-blue-700' 
                                            : inRange 
                                              ? 'bg-blue-50 text-blue-600 font-extrabold hover:bg-blue-100/70' 
                                              : 'text-slate-655 hover:bg-slate-50 border border-transparent'
                                        }
                                    `}
                                >
                                    {m.short}
                                    {selected && (
                                        <span className="absolute bottom-1 right-1 bg-white/20 rounded-full p-0.5">
                                            <Check className="w-2 h-2 text-white stroke-[3]" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer Informasi Bantuan */}
                    <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-450 leading-relaxed">
                        <p className="font-semibold text-slate-500">💡 Tips Pemilihan Rentang:</p>
                        <p>Klik bulan awal, lalu klik bulan akhir untuk membuat rentang. Klik bulan mana saja untuk mereset pilihan.</p>
                    </div>
                </div>
            )}

            {/* Panel Dropdown - Mobile Center Modal */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setIsOpen(false)}>
                    <div 
                        className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 animate-scaleUp shadow-2xl border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Navigasi Tahun */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <button
                                type="button"
                                onClick={handlePrevYear}
                                className="p-2 hover:bg-slate-50 border border-slate-100 text-slate-500 rounded-xl transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-base font-black text-slate-800 tracking-tight">{year}</span>
                            <button
                                type="button"
                                onClick={handleNextYear}
                                className="p-2 hover:bg-slate-50 border border-slate-100 text-slate-500 rounded-xl transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Grid Bulan */}
                        <div className="grid grid-cols-3 gap-3">
                            {MONTHS.map((m) => {
                                const selected = isSelected(m.id);
                                const inRange = isInRange(m.id);

                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => handleMonthClick(m.id)}
                                        className={`h-12 rounded-xl text-xs font-bold transition-all duration-200 relative flex items-center justify-center
                                            ${selected 
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                                                : inRange 
                                                  ? 'bg-blue-50 text-blue-600 font-extrabold' 
                                                  : 'text-slate-655 bg-slate-50 hover:bg-slate-100 border border-transparent'
                                            }
                                        `}
                                    >
                                        {m.short}
                                        {selected && (
                                            <span className="absolute bottom-1 right-1 bg-white/20 rounded-full p-0.5">
                                                <Check className="w-2 h-2 text-white stroke-[3]" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tombol Konfirmasi Selesai di Mobile */}
                        <button 
                            type="button" 
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-1.5"
                        >
                            <Check className="w-4 h-4" /> Terapkan Rentang
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
