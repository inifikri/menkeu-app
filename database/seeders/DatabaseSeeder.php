<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Transaction::truncate();
        Wallet::truncate();
        Category::truncate();
        User::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Seed Users
        $suami = User::create([
            'name' => 'Suami',
            'email' => 'fhm@fikrifamily.com',
            'password' => bcrypt('123456'),
            'role' => 'Suami',
            'avatarColor' => 'bg-blue-500',
            'permissions' => [
                'kelola_dompet', 
                'kelola_anggota', 
                'lihat_log', 
                'reset_data', 
                'lihat_laporan', 
                'atur_budget', 
                'ekspor_data', 
                'kelola_kategori', 
                'lihat_dompet', 
                'topup_dompet', 
                'catat_transaksi'
            ],
        ]);

        $istri = User::create([
            'name' => 'Istri',
            'email' => 'adhs@fikrifamily.com',
            'password' => bcrypt('123456'),
            'role' => 'Istri',
            'avatarColor' => 'bg-pink-500',
            'permissions' => [
                'lihat_dompet', 
                'topup_dompet', 
                'catat_transaksi', 
                'lihat_laporan', 
                'atur_budget', 
                'ekspor_data'
            ],
        ]);

        // 2. Seed Parent Categories
        $parentCategories = [
            ['name' => 'Kebutuhan Pokok', 'icon' => 'Home', 'color' => 'bg-emerald-500', 'budget' => 0, 'priority_level' => 1, 'parent_id' => null],
            ['name' => 'Transportasi & Kerja', 'icon' => 'Car', 'color' => 'bg-blue-500', 'budget' => 0, 'priority_level' => 2, 'parent_id' => null],
            ['name' => 'Kebutuhan Pendukung', 'icon' => 'Settings', 'color' => 'bg-purple-500', 'budget' => 0, 'priority_level' => 3, 'parent_id' => null],
            ['name' => 'Kesehatan & Perawatan', 'icon' => 'HeartPulse', 'color' => 'bg-pink-400', 'budget' => 0, 'priority_level' => 4, 'parent_id' => null],
            ['name' => 'Gaya Hidup & Konsumtif', 'icon' => 'Sparkles', 'color' => 'bg-orange-500', 'budget' => 0, 'priority_level' => 5, 'parent_id' => null],
        ];

        $parents = [];
        foreach ($parentCategories as $pCat) {
            $parents[$pCat['name']] = Category::create($pCat);
        }

        // 3. Seed Child Categories related to parents
        $childCategories = [
            ['name' => 'Makan', 'icon' => 'Utensils', 'color' => 'bg-orange-500', 'budget' => 0, 'priority_level' => 1, 'parent' => 'Kebutuhan Pokok'],
            ['name' => 'Kebutuhan Dapur', 'icon' => 'ShoppingBasket', 'color' => 'bg-amber-500', 'budget' => 0, 'priority_level' => 1, 'parent' => 'Kebutuhan Pokok'],
            ['name' => 'Pokok', 'icon' => 'Home', 'color' => 'bg-emerald-500', 'budget' => 0, 'priority_level' => 1, 'parent' => 'Kebutuhan Pokok'],
            
            ['name' => 'Bensin', 'icon' => 'Fuel', 'color' => 'bg-red-500', 'budget' => 0, 'priority_level' => 2, 'parent' => 'Transportasi & Kerja'],
            ['name' => 'Penitipan Motor', 'icon' => 'ParkingCircle', 'color' => 'bg-slate-500', 'budget' => 0, 'priority_level' => 2, 'parent' => 'Transportasi & Kerja'],
            ['name' => 'Kartu KRL', 'icon' => 'Train', 'color' => 'bg-blue-500', 'budget' => 0, 'priority_level' => 2, 'parent' => 'Transportasi & Kerja'],
            ['name' => 'Permotoran', 'icon' => 'Wrench', 'color' => 'bg-zinc-500', 'budget' => 0, 'priority_level' => 2, 'parent' => 'Transportasi & Kerja'],
            
            ['name' => 'Kuota', 'icon' => 'Wifi', 'color' => 'bg-indigo-500', 'budget' => 0, 'priority_level' => 3, 'parent' => 'Kebutuhan Pendukung'],
            ['name' => 'Kebersihan', 'icon' => 'Droplets', 'color' => 'bg-cyan-500', 'budget' => 0, 'priority_level' => 3, 'parent' => 'Kebutuhan Pendukung'],
            ['name' => 'Lainnya', 'icon' => 'MoreHorizontal', 'color' => 'bg-slate-400', 'budget' => 0, 'priority_level' => 3, 'parent' => 'Kebutuhan Pendukung'],
            
            ['name' => 'Skincare & Bodycare', 'icon' => 'Sparkles', 'color' => 'bg-pink-400', 'budget' => 0, 'priority_level' => 4, 'parent' => 'Kesehatan & Perawatan'],
            ['name' => 'Buah-buahan', 'icon' => 'Apple', 'color' => 'bg-lime-500', 'budget' => 0, 'priority_level' => 4, 'parent' => 'Kesehatan & Perawatan'],
            
            ['name' => 'Jajan', 'icon' => 'Pizza', 'color' => 'bg-yellow-500', 'budget' => 0, 'priority_level' => 5, 'parent' => 'Gaya Hidup & Konsumtif'],
            ['name' => 'Ngopi', 'icon' => 'Coffee', 'color' => 'bg-amber-700', 'budget' => 0, 'priority_level' => 5, 'parent' => 'Gaya Hidup & Konsumtif'],
            ['name' => 'Rokok', 'icon' => 'Cigarette', 'color' => 'bg-stone-500', 'budget' => 0, 'priority_level' => 5, 'parent' => 'Gaya Hidup & Konsumtif'],
            ['name' => 'Piutang', 'icon' => 'CreditCard', 'color' => 'bg-rose-500', 'budget' => 0, 'priority_level' => 5, 'parent' => 'Gaya Hidup & Konsumtif'],
        ];

        $catModels = [];
        foreach ($parents as $name => $pModel) {
            $catModels[$name] = $pModel;
        }

        foreach ($childCategories as $cData) {
            $parentModel = $parents[$cData['parent']] ?? null;
            $catModels[$cData['name']] = Category::create([
                'name' => $cData['name'],
                'icon' => $cData['icon'],
                'color' => $cData['color'],
                'budget' => $cData['budget'],
                'priority_level' => $cData['priority_level'],
                'parent_id' => $parentModel ? $parentModel->id : null,
            ]);
        }



        // 5. Pre-calculate and cache dashboard metrics so first load is instant
        $analyticsService = new \App\Services\DashboardAnalyticsService();
        $analyticsService->calculateAndCache();
    }
}
