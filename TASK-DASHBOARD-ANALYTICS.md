# TASK DIRECTIVE: Advanced Analytics & Prescriptive Financial Dashboard

## 1. STRICT SCOPE OF WORK & CONSTRAINTS
- **PRIMARY FOCUS:** Pengembangan dan penyempurnaan fitur khusus pada modul **Dashboard** semata.
- **RESTRICTION:** **DILARANG KERAS** mengubah, memodifikasi, atau melakukan *refactoring* pada kode yang tidak berkaitan langsung dengan sajian data di Dashboard. Modul berikut harus tetap statis dan tidak boleh disentuh:
  - Sistem Autentikasi & Role Login
  - CRUD Transaksi Pengeluaran & antarmuka Bulk Entry
  - Top Up Dompet (Suami-Istri)
  - Manajemen Kategori
  - Pengaturan Budgeting Bulanan
- **TARGET ARCHITECTURE:** Laravel 13 (Backend API), React (Frontend SPA/Components), MySQL (Relational Database).

---

## 2. OPERATIONAL CONTEXT & BASELINE
- **Pola Input Pengguna:** Pengguna tidak melakukan input harian, melainkan menggunakan pendekatan **Siklus Rekonsiliasi Mingguan** (input data massal/bulk entry dilakukan 1 minggu sekali pada akhir pekan).
- **Implikasi Metrik:** Seluruh indikator, grafik, dan peringatan di Dashboard harus dikalibrasi untuk pendekatan mingguan. Hindari metrik harian yang dapat memberikan asumsi semu (*false positive/negative*) akibat jeda input.

---

## 3. DASHBOARD PRESENTATION REQUIREMENTS (DETAILED ELEMENTS)

Halaman Dashboard harus menyajikan 5 elemen analitik utama berikut:

### A. Panel Status & Pacing Mingguan
- **Sisa Anggaran Aman (*Safe-to-Spend* per Minggu):** Menampilkan kalkulasi sisa anggaran bulanan dibagi dengan sisa minggu yang tersedia dalam bulan berjalan.
- **Indikator Visual:** Gunakan pengkodean warna tegas (Hijau: Aman/Sesuai Jalur, Kuning: Waspada/Mendekati Batas, Merah: Defisit/Over-budget).
- **Status Sinkronisasi:** Tampilkan *timestamp* validasi terakhir (contoh: *"Data terkalibrasi berdasarkan input minggu ke-2"*).

### B. Analisis Kecepatan Pembakaran Dana (*Burn Rate & Runway*)
- **Fokus Metrik:** Gabungan likuiditas dari dompet Suami dan Istri.
- **Visualisasi *Time-to-Zero*:** Tampilkan estimasi waktu (dalam hari/minggu) kapan saldo dompet gabungan akan habis jika pola pengeluaran mingguan saat ini berlanjut.
- **Ringkasan Naratif:** Teks kesimpulan otomatis (contoh: *"Proyeksi: Saldo dompet gabungan akan habis 4 hari sebelum akhir bulan. Diperlukan penyesuaian sebesar Rp X."*).

### C. Peringatan Dini Deviasi Kategori (*Anomaly Detection*)
- **Daftar Peringatan:** Tampilkan komponen *alert* khusus yang hanya muncul jika terdapat pengeluaran kategori yang melampaui batas wajar.
- **Komparasi Historis:** Bandingkan pengeluaran minggu ini dengan deviasi standar dari rata-rata 3 bulan terakhir.
- **Analisis Dampak:** Tunjukkan persentase dampak deviasi tersebut terhadap sisa anggaran kebutuhan pokok rumah tangga.

### D. Proyeksi Kebutuhan Pokok Bulan Depan (*Dynamic Forecasting*)
- **Fokus Kategori:** Kebutuhan dasar dengan harga berfluktuasi (seperti Dapur, Kebersihan, dan Belanja Pokok).
- **Tabel Komparasi:** Tampilkan anggaran bulan berjalan bersanding dengan **Estimasi Kebutuhan Bulan Depan**.
- **Sinyal Tren:** Berikan keterangan persentase kenaikan atau penurunan tren konsumsi untuk membantu penentuan *budget* bulan berikutnya.

### E. Modul Rekomendasi Aksi (*Prescriptive Insights*)
- **Action Items:** Sajikan maksimal 3 instruksi konkret berbasis data yang harus dilakukan pengguna pada minggu berikutnya.
- **Aturan Logika Rekomendasi:**
  - Jika terjadi defisit di kategori sekunder: Berikan saran pemotongan nominal spesifik pada kategori tersebut untuk minggu depan.
  - Jika terdapat surplus likuiditas: Berikan saran alokasi pemindahan dana ke tabungan atau penutupan defisit kategori lain.

---

## 4. TECHNICAL IMPLEMENTATION STRATEGY

Untuk menjaga performa aplikasi tetap cepat dan responsif tanpa membebani *server*, terapkan arsitektur berikut:

### A. Backend Layer (Laravel 13)
- **Event-Driven Calculation:** Jangan jalankan kalkulasi statistik berat secara *real-time* saat halaman Dashboard dimuat.
- **Observer / Listener:** Buat sebuah Event Listener yang terpicu secara otomatis hanya setelah proses **Bulk Entry** berhasil disimpan ke database.
- **Data Snapshot:** Kalkulasi seluruh metrik (Z-Score untuk anomali, Exponential Moving Average/EMA untuk prediksi, dan Runway) pada *event* tersebut, lalu simpan hasilnya dalam bentuk JSON *snapshot* di tabel khusus (misalnya `dashboard_analytics_cache`).
- **API Endpoint:** Buat satu *endpoint* API bersih (`GET /api/dashboard/metrics`) yang hanya bertugas mengambil data dari tabel *cache* tersebut.

### B. Database Layer (MySQL)
- Gunakan *Window Functions* (`AVG() OVER`, `STDDEV() OVER`) pada *query* agregasi historis untuk mempercepat perhitungan statistik di level database.
- Pastikan indeks (*indexing*) diterapkan dengan benar pada kolom `user_id`, `category_id`, dan `transaction_date`.

### C. Frontend Layer (React)
- **Single Source of Truth:** Halaman Dashboard hanya melakukan satu kali *fetch* ke *endpoint* metrics saat komponen di-mount.
- **Presentational Focus:** Frontend murni bertugas sebagai *renderer* visual (grafik, tabel, *cards*) menggunakan data JSON yang sudah matang dari backend, tanpa melakukan kalkulasi rumus matematika rumit di sisi klien.

---

## 5. ACCEPTANCE CRITERIA
1. Seluruh 5 elemen informasi Dashboard tampil dengan data yang konsisten dan akurat sesuai data historis.
2. Waktu pemuatan halaman Dashboard (*page load time*) di bawah 1 detik karena menggunakan sistem *snapshot/cache*.
3. Tidak ada regresi atau perubahan fungsionalitas pada fitur Login, Input Transaksi, Bulk Entry, Top Up, dan Budgeting.