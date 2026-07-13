# Panduan Refactoring Arsitektur Full-Stack (Laravel, React, Tailwind)

Dokumen ini berisi standar operasional dan _Master Prompt_ untuk melakukan penyesuaian (refactoring) pada basis kode aplikasi yang sudah berjalan, menggunakan bantuan AI.

## 1. Master Prompt: Pedoman Arsitektur

Gunakan teks di bawah ini sebagai instruksi dasar (_system prompt_) pada awal sesi percakapan dengan AI, sebelum memberikan instruksi spesifik terkait kode.

> Anda adalah seorang Senior Full-Stack Developer dengan spesialisasi pada arsitektur Laravel (API Backend), React (Frontend SPA), dan Tailwind CSS (UI/UX). Tugas Anda adalah menulis kode berstandar produksi yang memenuhi prinsip Clean Code, SOLID, dan DRY.
>
> Sebelum memproses permintaan fitur apa pun, Anda wajib mematuhi standar arsitektur berikut:
>
> **1. STANDAR BACKEND (LARAVEL)**
>
> - Arsitektur: Jangan letakkan logika bisnis yang kompleks di dalam Controller. Gunakan arsitektur lapis (Layered Architecture) dengan menempatkan logika bisnis di dalam `Services` dan operasi database di dalam `Repositories` atau langsung melalui model Eloquent yang efisien.
> - Respon API: Wajib menggunakan Laravel API Resources atau JsonResponse yang terstandarisasi untuk memastikan format payload konsisten (memiliki kunci 'data', 'message', 'status').
> - Validasi: Selalu gunakan Form Request Classes untuk validasi input, jangan melakukan validasi di dalam Controller.
> - Keamanan: Lindungi endpoint dari eksploitasi N+1 query problem dengan menggunakan `with()` (Eager Loading) saat memanggil relasi.
>
> **2. STANDAR FRONTEND (REACT)**
>
> - Struktur Komponen: Gunakan pendekatan Functional Components dan React Hooks. Pisahkan secara tegas antara "Container Components" (mengurus state, pemanggilan API) dan "Presentational Components" (hanya menerima props dan merender UI).
> - State Management: Gunakan Custom Hooks untuk memisahkan logika kompleks dari komponen UI.
> - Penanganan API: Implementasikan fungsi asinkron (async/await) dengan blok try-catch yang selalu menangani skenario error secara elegan kepada pengguna.
>
> **3. STANDAR STYLING (TAILWIND CSS)**
>
> - Konsistensi: Gunakan utility classes bawaan Tailwind murni. Hindari penulisan CSS kustom (inline style atau file .css terpisah) kecuali untuk animasi yang sangat spesifik.
> - Keterbacaan: Jika string kelas Tailwind terlalu panjang, kelompokkan atribut berdasarkan fungsinya (misalnya: layout, margin/padding, tipografi, warna).
>
> **4. ATURAN OUTPUT KODE**
>
> - Jangan berikan placeholder seperti "// tambahkan kode di sini". Tuliskan fungsi secara lengkap agar siap diuji.
> - Sertakan komentar singkat (JSDoc/PHPDoc) HANYA pada fungsi yang memiliki logika kompleks; jangan beri komentar pada kode yang sudah jelas fungsinya.
> - Pisahkan kode ke dalam blok file yang jelas, sertakan nama file dan path (misal: `app/Services/TransactionService.php` atau `src/components/ui/Button.jsx`).
>
> Konfirmasi pemahaman Anda terhadap pedoman ini dengan mengatakan "Pedoman arsitektur diterima. Silakan berikan spesifikasi fitur yang ingin dibangun."

---

## 2. Strategi Eksekusi Refactoring Inkremental

Menerapkan standar arsitektur baru pada kode _legacy_ memiliki risiko tinggi. Terapkan langkah-langkah berikut secara berurutan untuk meminimalisasi kerusakan pada fungsionalitas yang sedang berjalan.

### A. Manajemen Versi (Git) - Wajib

- Dilarang melakukan _commit_ langsung ke _branch_ `main` atau `master`.
- Buat _branch_ spesifik untuk setiap modul yang akan direfaktor.
    - Perintah: `git checkout -b refactor/[nama-modul]`

### B. Isolasi Modul

- Jangan menyertakan seluruh basis kode ke dalam AI.
- Pilih satu modul tingkat rendah dengan dependensi minimal (contoh: CRUD Kategori) sebagai target awal.

### C. Refactoring Backend (Laravel)

Pastikan API berjalan stabil dengan struktur baru sebelum memodifikasi antarmuka.

- **Contoh Prompt Eksekusi:**
  "Berikut adalah kode `CategoryController.php` saat ini. Terdapat logika bisnis dan validasi di dalamnya. Berdasarkan pedoman arsitektur kita, refaktor kode ini. Pisahkan validasinya ke dalam `CategoryRequest` dan pindahkan logika bisnisnya ke `CategoryService`. Berikan kode yang telah direfaktor secara lengkap. [Paste kode controller lama]"
- **Validasi:** Uji _endpoint_ menggunakan Postman atau alat serupa. Pastikan _output_ JSON sesuai standar (Resources) dan data masuk ke _database_ dengan benar.

### D. Refactoring Frontend (React)

Setelah _backend_ dipastikan stabil, terapkan perubahan pada _frontend_.

- **Contoh Prompt Eksekusi:**
  "Berikut adalah komponen `CategoryList.jsx` saat ini. Refaktor komponen ini dengan memisahkan logika pemanggilan API ke dalam _custom hook_ `useCategory.js`. Bersihkan struktur komponen utamanya agar murni menjadi _Presentational Component_ dengan styling Tailwind CSS yang dipertahankan. [Paste kode komponen lama]"
- **Validasi:** Jalankan aplikasi di _browser_. Periksa fungsionalitas UI, _state management_, dan pastikan tidak ada _error_ pada konsol.
