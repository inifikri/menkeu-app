# Spesifikasi Eksekusi Terfokus: Modul RBAC, Pelacakan Individu, dan Fund Routing

## 1. Lingkup Pekerjaan & Batasan Sistem Mutlak (Strict Constraints)

- **Fokus Eksekusi:** Instruksi ini hanya ditujukan untuk mengimplementasikan otorisasi berbasis peran (RBAC), modifikasi struktur kepemilikan kategori (`managed_by`), dan pembuatan kalkulasi otomatis nilai transfer bulanan.
- **Isolasi Modul:** DILARANG KERAS memodifikasi, menghapus, atau menulis ulang _controller_, _routing_, atau antarmuka pada modul dasar yang sudah ada (Login, Pencatatan Transaksi Dasar, Top Up Dompet Utama).
- **Integritas Data:** Seluruh perubahan skema _database_ wajib dilakukan melalui file _migration_ baru (bersifat penambahan/aditif). Dilarang menghapus tabel atau kolom yang sudah ada.

## 2. Modifikasi Struktur Data (Pelacakan Individu)

- **Tugas Backend (MySQL/Laravel):**
    - Buat _migration_ untuk menambahkan kolom `role` (enum: `admin`, `contributor`, default: `contributor`) pada tabel `users`.
    - Buat _migration_ untuk menambahkan kolom `managed_by` (enum: `Fikri`, `Tia`, `Bersama`, default: `Bersama`) pada tabel `categories` (atau pada tabel alokasi _budget_ terkait).
    - Pastikan _seeder_ atau _factory_ tidak menimpa data yang sudah ada di basis data utama.

## 3. Implementasi Hak Akses (RBAC) pada Sistem

- **Tugas Backend (Laravel):**
    - Implementasikan Laravel _Policies_ atau _Middleware_ khusus untuk memverifikasi `role` pengguna.
    - **Aturan Otorisasi:**
        - `admin` (Suami): Memiliki akses penuh (Create, Read, Update, Delete) ke seluruh _endpoint_ perencanaan, pengaturan _Waterfall Allocation_, dan eksekusi penutupan bulan.
        - `contributor` (Istri): Memiliki akses _Read-Only_ pada data perencanaan dan _budgeting_ makro. Dilarang melakukan operasi mutasi (Create, Update, Delete) pada arsitektur _budget_, namun diizinkan melakukan _POST_ pada _endpoint_ pencatatan (_Bulk Entry_) untuk kategori yang memiliki status `managed_by = Tia`.

## 4. Logika Kalkulasi Otomatis Nilai Transfer (Fund Routing)

- **Tugas Backend (Laravel):**
    - Pada layanan kalkulasi _budget_ (`BudgetService` atau setara), buat metode baru bernama `calculateTransferRouting()`.
    - Metode ini bertugas menjumlahkan (`SUM`) total nominal batas anggaran awal bulan khusus untuk seluruh kategori yang memiliki atribut `managed_by = Tia`.
    - Sisipkan hasil kalkulasi ini ke dalam _payload_ respons JSON saat memuat halaman utama _Budgeting_ (contoh kunci JSON: `transfer_to_contributor_amount`).

## 5. Penyesuaian Antarmuka (React UI)

- **Tugas Frontend (React):**
    - Terapkan _Conditional Rendering_ berdasarkan profil `role` pengguna yang sedang _login_.
    - **Tampilan untuk Contributor (Istri):**
        - Ubah seluruh _input field_ pada halaman _Budgeting_ (Perencanaan) menjadi atribut `disabled` atau `read-only`.
        - Sembunyikan elemen tindakan struktural secara penuh (tombol "Simpan Anggaran", "Tutup Bulan", atau "Ubah Prioritas").
    - **Tampilan untuk Admin (Suami):**
        - Tampilkan seluruh elemen interaktif secara normal.
        - Buat sebuah komponen _Alert Panel_ khusus di bagian atas halaman _Budgeting_. Panel ini harus memuat data dari kunci API `transfer_to_contributor_amount`.
        - _Format Visual Panel Alert:_ "Tindakan Diperlukan: Alokasikan dana operasional sebesar Rp[Jumlah] ke rekening Istri berdasarkan struktur anggaran bulan ini."
