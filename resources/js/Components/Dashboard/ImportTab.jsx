import React, { useState, useMemo } from "react";
import { Info, Download, Upload, Search, Trash2, RefreshCw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImportTab({
    categories,
    wallets,
    members,
    currentUser,
    downloadTemplate,
    handleFileChange,
    importFileName,
    setImportFileName,
    setSelectedFile,
    importedData,
    setImportedData,
    isImporting,
    handleImportSubmit,
}) {
    const [importItemsPerPage, setImportItemsPerPage] = useState(5);
    const [importCurrentPage, setImportCurrentPage] = useState(1);
    const [importSearchQuery, setImportSearchQuery] = useState("");

    const formatIDR = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    // Handle editing a cell in the preview table
    const handleCellEdit = (originalIndex, field, value) => {
        setImportedData((prev) =>
            prev.map((row, idx) => (idx === originalIndex ? { ...row, [field]: value } : row))
        );
    };

    // Handle deleting a row from imported data
    const handleDeleteImportRow = (originalIndex) => {
        setImportedData((prev) => prev.filter((_, idx) => idx !== originalIndex));
        // Reset current page if the list shrinks
        setImportCurrentPage(1);
    };

    // Add originalIndex to each row to track edits properly
    const processedData = useMemo(() => {
        return importedData.map((row, idx) => ({ ...row, originalIndex: idx }));
    }, [importedData]);

    const filteredImportedData = useMemo(() => {
        if (!importSearchQuery.trim()) return processedData;
        const q = importSearchQuery.toLowerCase();
        return processedData.filter(
            (row) =>
                (row.description && row.description.toLowerCase().includes(q)) ||
                (row.categoryName && row.categoryName.toLowerCase().includes(q)) ||
                (row.walletName && row.walletName.toLowerCase().includes(q)) ||
                (row.memberName && row.memberName.toLowerCase().includes(q))
        );
    }, [processedData, importSearchQuery]);

    const totalImportPages = Math.ceil(filteredImportedData.length / importItemsPerPage) || 1;

    const paginatedImportedData = useMemo(() => {
        const start = (importCurrentPage - 1) * importItemsPerPage;
        return filteredImportedData.slice(start, start + importItemsPerPage);
    }, [filteredImportedData, importCurrentPage, importItemsPerPage]);

    return (
        <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
            {/* Card 1: Dokumentasi & Unduh Template */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                        <Info className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg text-slate-900">
                            Panduan Import Transaksi Pengeluaran
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Anda dapat mencatat banyak transaksi pengeluaran sekaligus dengan mengunggah file spreadsheet berformat `.csv`. Pastikan berkas Anda mengikuti struktur kolom berikut agar dapat diproses tanpa error.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-700 block">Tanggal</span>
                                <span className="text-slate-400 text-[10px]">Format: YYYY-MM-DD</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-700 block">Deskripsi</span>
                                <span className="text-slate-400 text-[10px]">Nama/keterangan belanja</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-700 block">Nominal</span>
                                <span className="text-slate-400 text-[10px]">Angka bulat (contoh: 50000)</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-700 block">Kategori</span>
                                <span className="text-slate-400 text-[10px]">Misal: Makan, Bensin, dll.</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-700 block">Dompet</span>
                                <span className="text-slate-400 text-[10px]">Misal: BCA Ayah, Mandiri Ibu</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-700 block">Anggota Keluarga</span>
                                <span className="text-slate-400 text-[10px]">Misal: Ayah (Admin), Ibu</span>
                            </div>
                        </div>
                        <div className="pt-4 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={downloadTemplate}
                                className="px-4 py-2 border border-blue-200 hover:border-blue-300 text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
                            >
                                <Download className="w-3.5 h-3.5" /> Unduh Template format_import.csv
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Dropzone Pengunggahan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-md text-slate-800 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-500" /> Unggah File CSV
                </h3>

                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center transition-all bg-slate-50/50 hover:bg-blue-50/10 relative group">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                        </div>
                        {importFileName ? (
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-800">{importFileName}</p>
                                <p className="text-xs text-blue-600 font-medium">Klik atau seret file lain untuk mengganti</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-700">Pilih berkas CSV Anda</p>
                                <p className="text-xs text-slate-400">Seret & lepas berkas ke sini, atau klik untuk mencari berkas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card 3: Preview Data (Tampil hanya jika ada data pratinjau) */}
            <AnimatePresence>
                {importedData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="font-bold text-md text-slate-800">
                                    Pratinjau & Edit Data Transaksi (.CSV)
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Anda dapat mengedit data langsung pada tabel di bawah ini seperti Excel sebelum menyimpannya.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Limit Selector */}
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <span>Baris:</span>
                                    <select
                                        value={importItemsPerPage}
                                        onChange={(e) => {
                                            setImportItemsPerPage(parseInt(e.target.value) || 5);
                                            setImportCurrentPage(1);
                                        }}
                                        className="border border-slate-200 focus:border-blue-400 rounded-xl pl-2.5 pr-8 py-1 text-xs outline-none bg-white cursor-pointer transition-colors"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        placeholder="Cari pratinjau..."
                                        value={importSearchQuery}
                                        onChange={(e) => {
                                            setImportSearchQuery(e.target.value);
                                            setImportCurrentPage(1);
                                        }}
                                        className="pl-8 pr-4 py-1.5 border border-slate-200 focus:border-blue-400 rounded-xl text-xs focus:ring-0 outline-none transition-colors w-48"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImportedData([]);
                                        setImportFileName("");
                                        setSelectedFile(null);
                                    }}
                                    className="text-xs font-bold text-rose-500 hover:underline"
                                >
                                    Hapus File
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-slate-100 rounded-xl">
                            <table className="w-full min-w-[1080px] text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 font-bold text-slate-500 border-b border-slate-100">
                                        <th className="p-3 w-32">Tanggal</th>
                                        <th className="p-3 min-w-[280px]">Deskripsi</th>
                                        <th className="p-3 w-40">Nominal</th>
                                        <th className="p-3 w-40">Kategori</th>
                                        <th className="p-3 w-40">Dompet</th>
                                        <th className="p-3 w-40">Anggota</th>
                                        <th className="p-3 w-32">Status</th>
                                        <th className="p-3 w-20 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-slate-700">
                                    {paginatedImportedData.map((row) => {
                                        const rowDate = row.date || "";
                                        const rowDesc = row.description || "";
                                        const rowAmt =
                                            typeof row.amount === "number" && !isNaN(row.amount)
                                                ? row.amount
                                                : 0;
                                        const rowCatName = row.categoryName || "";
                                        const rowWalletName = row.walletName || "";
                                        const rowMemberName = row.memberName || "";

                                        const dateValid = rowDate && !isNaN(Date.parse(rowDate));
                                        const amountValid = rowAmt > 0;

                                        const walletObj = wallets.find(
                                            (w) =>
                                                w.name &&
                                                w.name.toLowerCase() === rowWalletName.toLowerCase()
                                        );

                                        let statusType = "success";
                                        let statusMsg = "Valid";

                                        if (!dateValid) {
                                            statusType = "error";
                                            statusMsg = "Format Tanggal Salah";
                                        } else if (!amountValid) {
                                            statusType = "error";
                                            statusMsg = "Nominal harus > 0";
                                        } else if (!walletObj) {
                                            statusType = "error";
                                            statusMsg = "Dompet tidak terdaftar";
                                        } else if (
                                            rowCatName &&
                                            !categories.find(
                                                (c) =>
                                                    c.name &&
                                                    c.name.toLowerCase() === rowCatName.toLowerCase()
                                            )
                                        ) {
                                            statusType = "warning";
                                            statusMsg = 'Kategori masuk ke "Lainnya"';
                                        } else if (
                                            rowMemberName &&
                                            !members.find(
                                                (m) =>
                                                    m.name &&
                                                    m.name.toLowerCase() === rowMemberName.toLowerCase()
                                            )
                                        ) {
                                            statusType = "warning";
                                            statusMsg = `Masuk ke akun ${currentUser?.name || "User"}`;
                                        }

                                        return (
                                            <tr
                                                key={row.originalIndex}
                                                className="hover:bg-slate-50/30 transition-colors"
                                            >
                                                {/* Tanggal */}
                                                <td className="p-2">
                                                    <input
                                                        type="date"
                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 text-xs w-full font-mono outline-none"
                                                        value={rowDate}
                                                        onChange={(e) =>
                                                            handleCellEdit(
                                                                row.originalIndex,
                                                                "date",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>
                                                {/* Deskripsi */}
                                                <td className="p-2 min-w-[280px]">
                                                    <input
                                                        type="text"
                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 text-xs w-full outline-none"
                                                        value={rowDesc}
                                                        onChange={(e) =>
                                                            handleCellEdit(
                                                                row.originalIndex,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>
                                                {/* Nominal */}
                                                <td className="p-2">
                                                    <div className="space-y-0.5">
                                                        <input
                                                            type="number"
                                                            className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded p-1 text-xs w-full font-semibold outline-none"
                                                            value={rowAmt}
                                                            onChange={(e) =>
                                                                handleCellEdit(
                                                                    row.originalIndex,
                                                                    "amount",
                                                                    parseFloat(e.target.value) || 0
                                                                )
                                                            }
                                                        />
                                                        <div className="text-[10px] text-slate-400 px-1 font-medium font-sans">
                                                            {formatIDR(rowAmt)}
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Kategori */}
                                                <td className="p-2">
                                                    <select
                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded py-1 pl-1.5 pr-7 text-xs w-full outline-none cursor-pointer"
                                                        value={rowCatName}
                                                        onChange={(e) =>
                                                            handleCellEdit(
                                                                row.originalIndex,
                                                                "categoryName",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {categories.map((c) => (
                                                            <option key={c.id} value={c.name}>
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                {/* Dompet */}
                                                <td className="p-2">
                                                    <select
                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded py-1 pl-1.5 pr-7 text-xs w-full outline-none text-slate-500 font-medium cursor-pointer"
                                                        value={rowWalletName}
                                                        onChange={(e) =>
                                                            handleCellEdit(
                                                                row.originalIndex,
                                                                "walletName",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">-- Pilih --</option>
                                                        {wallets.map((w) => (
                                                            <option key={w.id} value={w.name}>
                                                                {w.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                {/* Anggota */}
                                                <td className="p-2">
                                                    <select
                                                        className="bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded py-1 pl-1.5 pr-7 text-xs w-full outline-none text-slate-600 font-medium cursor-pointer"
                                                        value={rowMemberName}
                                                        onChange={(e) =>
                                                            handleCellEdit(
                                                                row.originalIndex,
                                                                "memberName",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {members.map((m) => (
                                                            <option key={m.id} value={m.name}>
                                                                {m.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                {/* Status */}
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                            statusType === "success"
                                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                                : statusType === "warning"
                                                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                                                : "bg-rose-50 text-rose-600 border border-rose-100"
                                                        }`}
                                                    >
                                                        {statusMsg}
                                                    </span>
                                                </td>
                                                {/* Aksi */}
                                                <td className="p-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteImportRow(row.originalIndex)
                                                        }
                                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                                                        title="Hapus Baris"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 text-xs gap-3">
                            <span className="text-slate-500">
                                Menampilkan{" "}
                                {filteredImportedData.length > 0
                                    ? (importCurrentPage - 1) * importItemsPerPage + 1
                                    : 0}{" "}
                                - {Math.min(importCurrentPage * importItemsPerPage, filteredImportedData.length)}{" "}
                                dari {filteredImportedData.length} baris
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={importCurrentPage === 1}
                                    onClick={() => setImportCurrentPage((prev) => Math.max(1, prev - 1))}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl disabled:opacity-50 disabled:hover:bg-transparent transition-all font-bold text-slate-600"
                                >
                                    Sebelumnya
                                </button>
                                <span className="font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    Halaman {importCurrentPage} dari {totalImportPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={importCurrentPage === totalImportPages}
                                    onClick={() =>
                                        setImportCurrentPage((prev) =>
                                            Math.min(totalImportPages, prev + 1)
                                        )
                                    }
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl disabled:opacity-50 disabled:hover:bg-transparent transition-all font-bold text-slate-600"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setImportedData([]);
                                    setImportFileName("");
                                    setSelectedFile(null);
                                }}
                                className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-bold transition-all"
                            >
                                Batalkan
                            </button>
                            <button
                                type="button"
                                disabled={
                                    isImporting ||
                                    importedData.length === 0 ||
                                    importedData.some((row) => {
                                        const rowDate = row.date || "";
                                        const rowAmt =
                                            typeof row.amount === "number" && !isNaN(row.amount)
                                                ? row.amount
                                                : 0;
                                        const rowWalletName = row.walletName || "";
                                        const dateValid = rowDate && !isNaN(Date.parse(rowDate));
                                        const amountValid = rowAmt > 0;
                                        const walletObj = wallets.find(
                                            (w) =>
                                                w.name &&
                                                w.name.toLowerCase() === rowWalletName.toLowerCase()
                                        );
                                        return !walletObj || !dateValid || !amountValid;
                                    })
                                }
                                onClick={handleImportSubmit}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isImporting ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        Mengimpor...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        Simpan & Import {importedData.length} Transaksi
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
