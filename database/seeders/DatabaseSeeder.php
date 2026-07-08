<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Ayah (Admin)',
            'email' => 'ayah@finkeluarga.com',
            'password' => bcrypt('123456'),
            'role' => 'Administrator',
            'avatarColor' => 'bg-indigo-600',
            'permissions' => ['kelola_anggota', 'kelola_kategori', 'catat_transaksi', 'lihat_laporan', 'ekspor_data', 'kelola_dompet', 'atur_budget'],
        ]);

        $ibu = User::create([
            'name' => 'Ibu',
            'email' => 'ibu@finkeluarga.com',
            'password' => bcrypt('123456'),
            'role' => 'Istri',
            'avatarColor' => 'bg-pink-500',
            'permissions' => ['catat_transaksi', 'lihat_laporan', 'kelola_kategori', 'atur_budget'],
        ]);

        $kakak = User::create([
            'name' => 'Kakak',
            'email' => 'kakak@finkeluarga.com',
            'password' => bcrypt('123456'),
            'role' => 'Anak 1',
            'avatarColor' => 'bg-blue-400',
            'permissions' => ['catat_transaksi', 'lihat_laporan'],
        ]);

        $adik = User::create([
            'name' => 'Adik',
            'email' => 'adik@finkeluarga.com',
            'password' => bcrypt('123456'),
            'role' => 'Anak 2',
            'avatarColor' => 'bg-emerald-400',
            'permissions' => ['catat_transaksi'],
        ]);

        $categories = [
            ['name' => 'Makan', 'icon' => 'Utensils', 'color' => 'bg-orange-500', 'budget' => 3000000],
            ['name' => 'Jajan', 'icon' => 'Pizza', 'color' => 'bg-yellow-500', 'budget' => 1000000],
            ['name' => 'Kartu KRL', 'icon' => 'Train', 'color' => 'bg-blue-500', 'budget' => 500000],
            ['name' => 'Penitipan Motor', 'icon' => 'ParkingCircle', 'color' => 'bg-slate-500', 'budget' => 150000],
            ['name' => 'Pokok', 'icon' => 'Home', 'color' => 'bg-emerald-500', 'budget' => 4000000],
            ['name' => 'Rokok', 'icon' => 'Cigarette', 'color' => 'bg-stone-500', 'budget' => 500000],
            ['name' => 'Permotoran', 'icon' => 'Wrench', 'color' => 'bg-zinc-500', 'budget' => 300000],
            ['name' => 'Bensin', 'icon' => 'Fuel', 'color' => 'bg-red-500', 'budget' => 600000],
            ['name' => 'Kebutuhan Dapur', 'icon' => 'ShoppingBasket', 'color' => 'bg-amber-500', 'budget' => 1500000],
            ['name' => 'Kebersihan', 'icon' => 'Droplets', 'color' => 'bg-cyan-500', 'budget' => 300000],
            ['name' => 'Skincare & Bodycare', 'icon' => 'Sparkles', 'color' => 'bg-pink-400', 'budget' => 750000],
            ['name' => 'Kuota', 'icon' => 'Wifi', 'color' => 'bg-indigo-500', 'budget' => 400000],
            ['name' => 'Ngopi', 'icon' => 'Coffee', 'color' => 'bg-amber-700', 'budget' => 400000],
            ['name' => 'Piutang', 'icon' => 'CreditCard', 'color' => 'bg-rose-500', 'budget' => 0],
            ['name' => 'Buah-buahan', 'icon' => 'Apple', 'color' => 'bg-lime-500', 'budget' => 200000],
            ['name' => 'Lainnya', 'icon' => 'MoreHorizontal', 'color' => 'bg-slate-400', 'budget' => 500000],
        ];

        foreach ($categories as $cat) {
            \App\Models\Category::create($cat);
        }

        $bca = \App\Models\Wallet::create(['name' => 'BCA Ayah', 'balance' => 15000000, 'type' => 'Bank']);
        $mandiri = \App\Models\Wallet::create(['name' => 'Mandiri Ibu', 'balance' => 5000000, 'type' => 'Bank']);
        $tunai = \App\Models\Wallet::create(['name' => 'Uang Tunai', 'balance' => 1200000, 'type' => 'Tunai']);

        $makan = \App\Models\Category::where('name', 'Makan')->first();
        $pokok = \App\Models\Category::where('name', 'Pokok')->first();

        \App\Models\Transaction::create([
            'date' => '2026-07-01',
            'description' => 'Gaji Ayah Bulan Juli',
            'amount' => 20000000,
            'type' => 'income',
            'category_id' => $pokok->id,
            'wallet_id' => $bca->id,
            'user_id' => $admin->id
        ]);

        \App\Models\Transaction::create([
            'date' => '2026-07-02',
            'description' => 'Belanja Pasar',
            'amount' => 450000,
            'type' => 'expense',
            'category_id' => $makan->id,
            'wallet_id' => $tunai->id,
            'user_id' => $ibu->id
        ]);
    }
}
