# Spesifikasi Arsitektur Pengembangan: Modul Budgeting Lanjutan & Micro-Monitoring

## 1. Lingkup Pekerjaan & Batasan Keamanan (Strict Scope & Security Constraints)

- **Fokus Isolasi:** Instruksi ini ditujukan secara eksklusif untuk mengembangkan fitur pelacakan _micro-budgeting_, logika _waterfall allocation_, dan antarmuka pemantauan pada halaman Dashboard dan Modul Budgeting.
- **Larangan Modifikasi:** Dilarang keras memodifikasi struktur keamanan (Middleware/Auth), modul Login, infrastruktur Dompet Utama, serta _endpoint_ CRUD fundamental untuk pencatatan transaksi yang sudah berjalan.
- **Integritas Data:** Semua modifikasi skema _database_ harus dilakukan melalui _migration_ baru (bersifat aditif) tanpa menghapus, mengubah paksa, atau merusak data historis pengguna yang sudah ada di dalam _database_ MySQL.

## 2. Struktur Data Tingkat Mikro (Micro-Level Data Structure)

- **Target Pekerjaan:** Memperbarui skema tabel kategori untuk mendukung pelacakan level spesifik (seperti Bensin, Rokok, KRL, jajan, makan).
- **Tugas Backend (Laravel/MySQL):**
    - Buat _migration_ untuk menambahkan kolom `parent_id` (nullable, mereferensi `id` di tabel yang sama) dan `priority_level` (integer 1 hingga 5) pada tabel `categories` yang ada.
    - Buat relasi _Eloquent_ di model `Category` untuk memetakan hubungan _Parent_ dan _Children_.
    - Modifikasi logika penyimpanan limit _budget_ agar sistem dapat mengunci alokasi anggaran langsung pada level _child category_, bukan hanya pada kategori utama.

## 3. Strategi Budgeting: Waterfall Allocation

- **Target Pekerjaan:** Membangun logika distribusi dana otomatis berdasarkan hierarki prioritas.
- **Tugas Backend (Laravel):**
    - Bangun _Service Layer_ (misalnya `WaterfallAllocationService`) yang dijalankan saat awal bulan.
    - **Logika Kalkulasi:** Ambil parameter total pendapatan dari Dompet Utama. Validasi ketersediaan dana secara menurun dari Kategori Prioritas 1 hingga 4.
    - **Penetapan Otomatis:** Hitung rumus `Sisa Dana = Total Pendapatan - (Total Budget Level 1 hingga 4)`. Jadikan `Sisa Dana` ini sebagai limit batas atas yang mutlak (dikunci) untuk Kategori Prioritas 5 (Gaya Hidup/Konsumtif). Tolak segala _request_ API yang mencoba menetapkan _budget_ Level 5 secara manual yang melebihi batas ini.

## 4. Antarmuka Pemantauan (Micro-Monitoring UI)

- **Target Pekerjaan:** Pembuatan komponen pelacakan pengeluaran mikro di sisi klien.
- **Tugas Frontend (React):**
    - Buat komponen terisolasi bernama `MicroTrackerCard.jsx` untuk di-render pada _Dashboard_.
    - Tampilkan daftar sub-kategori (_child category_) yang memiliki anggaran aktif bulan ini.
    - Implementasikan _Progress Bar_ linier per item dengan rumus visual: `(Total Pengeluaran / Limit Anggaran Sub-Kategori) * 100`.
    - Terapkan pewarnaan kondisional mutlak: Hijau (0% - 50%), Kuning (51% - 80%), Merah (>80%).
    - Tampilkan angka absolut secara eksplisit di sebelah indikator (Format: "Terpakai: Rp[X] / Limit: Rp[Y]").

## 5. Logika Peringatan Sistem (System Warning Logic)

- **Target Pekerjaan:** Deteksi dini pembengkakan _burn rate_ berdasarkan proporsi waktu mingguan.
- **Tugas Backend & Frontend:**
    - **Backend:** Setiap kali proses _bulk entry_ mingguan selesai, jalankan observasi perhitungan. Hitung metrik "Persentase Waktu Berjalan" (contoh: akhir minggu kedua = 50% waktu bulan berjalan).
    - Bandingkan persentase waktu dengan persentase pemakaian di setiap _child category_.
    - Jika pemakaian anggaran > persentase waktu berjalan (misal: anggaran KRL terpakai 75% padahal waktu baru berjalan 50%), _backend_ mengembalikan status peringatan pada _payload_ API.
    - **Frontend:** Tangkap status peringatan tersebut dan render _alert banner_ dengan teks preskriptif: "Peringatan: Laju pemakaian anggaran [Nama Sub-Kategori] melebihi batas waktu operasional. Lakukan penyesuaian minggu ini."

## 6. Sinkronisasi Fase Operasional (Perencanaan hingga Rekonsiliasi)

- **Target Pekerjaan:** Menyelaraskan alur UI dengan standar operasional bulanan.
- **Tugas Frontend (React):**
    - **Fase Perencanaan:** Di halaman _Budgeting_, buat form sekuensial. Pengguna dilarang mengisi _budget_ prioritas rendah sebelum prioritas tinggi (1-4) diisi. Form Kategori Level 5 harus bersifat _read-only_ karena mengambil sisa hitungan _backend_.
    - **Fase Operasional:** Pastikan komponen `MicroTrackerCard` melakukan _re-fetch_ atau _re-render_ secara otomatis sesaat setelah _submit bulk entry_ berhasil.
    - **Fase Rekonsiliasi:** Sediakan tombol "Tutup Bulan". Aksi ini akan menyimpan _snapshot_ sisa _budget_ bulan berjalan dan menampilkan persentase akurasi anggaran sebagai acuan (_baseline_) peramalan untuk pengisian form perencanaan bulan berikutnya.
