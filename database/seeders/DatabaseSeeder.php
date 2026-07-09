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
        $admin = User::create([
            'name' => 'Admin Fikrikeluarga',
            'email' => 'admin@fikrifamily.com',
            'password' => bcrypt('123456'),
            'role' => 'Admin',
            'avatarColor' => 'bg-indigo-600',
            'permissions' => ['kelola_dompet', 'kelola_anggota', 'lihat_log', 'reset_data', 'lihat_laporan', 'atur_budget', 'ekspor_data', 'kelola_kategori'],
        ]);

        $suami = User::create([
            'name' => 'Suami',
            'email' => 'fhm@fikrifamily.com',
            'password' => bcrypt('123456'),
            'role' => 'Suami',
            'avatarColor' => 'bg-blue-500',
            'permissions' => ['lihat_dompet', 'topup_dompet', 'catat_transaksi', 'kelola_kategori', 'lihat_laporan', 'atur_budget', 'ekspor_data'],
        ]);

        $istri = User::create([
            'name' => 'Istri',
            'email' => 'adhs@fikrifamily.com',
            'password' => bcrypt('123456'),
            'role' => 'Istri',
            'avatarColor' => 'bg-pink-500',
            'permissions' => ['lihat_dompet', 'topup_dompet', 'catat_transaksi', 'kelola_kategori', 'lihat_laporan', 'atur_budget', 'ekspor_data'],
        ]);

        // 2. Seed Categories with logical monthly budgets
        $categories = [
            ['name' => 'Makan', 'icon' => 'Utensils', 'color' => 'bg-orange-500', 'budget' => 2000000],
            ['name' => 'Jajan', 'icon' => 'Pizza', 'color' => 'bg-yellow-500', 'budget' => 600000],
            ['name' => 'Kartu KRL', 'icon' => 'Train', 'color' => 'bg-blue-500', 'budget' => 400000],
            ['name' => 'Penitipan Motor', 'icon' => 'ParkingCircle', 'color' => 'bg-slate-500', 'budget' => 150000],
            ['name' => 'Pokok', 'icon' => 'Home', 'color' => 'bg-emerald-500', 'budget' => 1000000],
            ['name' => 'Rokok', 'icon' => 'Cigarette', 'color' => 'bg-stone-500', 'budget' => 300000],
            ['name' => 'Permotoran', 'icon' => 'Wrench', 'color' => 'bg-zinc-500', 'budget' => 200000],
            ['name' => 'Bensin', 'icon' => 'Fuel', 'color' => 'bg-red-500', 'budget' => 500000],
            ['name' => 'Kebutuhan Dapur', 'icon' => 'ShoppingBasket', 'color' => 'bg-amber-500', 'budget' => 3000000],
            ['name' => 'Kebersihan', 'icon' => 'Droplets', 'color' => 'bg-cyan-500', 'budget' => 200000],
            ['name' => 'Skincare & Bodycare', 'icon' => 'Sparkles', 'color' => 'bg-pink-400', 'budget' => 500000],
            ['name' => 'Kuota', 'icon' => 'Wifi', 'color' => 'bg-indigo-500', 'budget' => 300000],
            ['name' => 'Ngopi', 'icon' => 'Coffee', 'color' => 'bg-amber-700', 'budget' => 300000],
            ['name' => 'Piutang', 'icon' => 'CreditCard', 'color' => 'bg-rose-500', 'budget' => 0],
            ['name' => 'Buah-buahan', 'icon' => 'Apple', 'color' => 'bg-lime-500', 'budget' => 150000],
            ['name' => 'Lainnya', 'icon' => 'MoreHorizontal', 'color' => 'bg-slate-400', 'budget' => 300000],
        ];

        $catModels = [];
        foreach ($categories as $cat) {
            $catModels[$cat['name']] = Category::create($cat);
        }

        // 3. Seed Wallets
        $bca = Wallet::create(['name' => 'BCA Ayah', 'balance' => 0, 'type' => 'Bank']);
        $mandiri = Wallet::create(['name' => 'Mandiri Ibu', 'balance' => 0, 'type' => 'Bank']);
        $tunai = Wallet::create(['name' => 'Uang Tunai', 'balance' => 0, 'type' => 'Tunai']);

        // Let's create helper date references (May, June, July 2026)
        $months = [
            Carbon::create(2026, 5, 1),
            Carbon::create(2026, 6, 1),
            Carbon::create(2026, 7, 1)
        ];

        foreach ($months as $monthIndex => $firstOfMonth) {
            $monthNum = $firstOfMonth->month;
            $yearNum = $firstOfMonth->year;

            // Day 1: Gaji Ayah masuk ke BCA Ayah sebesar Rp 7.000.000
            Transaction::create([
                'date' => $firstOfMonth->copy()->day(1)->format('Y-m-d'),
                'description' => "Gaji Bulanan Ayah - Bulan " . $firstOfMonth->translatedFormat('F'),
                'amount' => 7000000,
                'type' => 'income',
                'category_id' => $catModels['Pokok']->id,
                'wallet_id' => $bca->id,
                'user_id' => $admin->id
            ]);

            // Day 2: Suami bagi/transfer gaji ke dompet Istri sebesar Rp 3.000.000 untuk kebutuhan dapur
            // Catat sebagai expense di dompet Suami, dan income di dompet Istri
            Transaction::create([
                'date' => $firstOfMonth->copy()->day(2)->format('Y-m-d'),
                'description' => "Transfer Uang Dapur Bulanan ke Istri",
                'amount' => 3000000,
                'type' => 'expense',
                'category_id' => $catModels['Lainnya']->id,
                'wallet_id' => $bca->id,
                'user_id' => $suami->id
            ]);

            Transaction::create([
                'date' => $firstOfMonth->copy()->day(2)->format('Y-m-d'),
                'description' => "Terima Uang Dapur Bulanan dari Suami",
                'amount' => 3000000,
                'type' => 'income',
                'category_id' => $catModels['Lainnya']->id,
                'wallet_id' => $mandiri->id,
                'user_id' => $istri->id
            ]);

            // Weekly expenditures: Dapur (Ibu), Bensin (Ayah), Makan (Ibu), Jajan (Kakak/Adik)
            // Seed 4 weeks of expenses
            for ($week = 1; $week <= 4; $week++) {
                $dayOfWeekOffset = ($week - 1) * 7;

                // Skip future transactions if we are in July and date is ahead of current date (July 8)
                if ($monthNum === 7 && (3 + $dayOfWeekOffset) > 8) {
                    continue;
                }

                // 1. Istri spends on Kebutuhan Dapur (weekly, e.g. Rp 600,000 - Rp 750,000)
                $dapurAmt = 600000 + ($week * 40000) + rand(-20000, 20000);
                Transaction::create([
                    'date' => $firstOfMonth->copy()->day(3 + $dayOfWeekOffset)->format('Y-m-d'),
                    'description' => "Belanja Dapur Mingguan - Minggu " . $week,
                    'amount' => $dapurAmt,
                    'type' => 'expense',
                    'category_id' => $catModels['Kebutuhan Dapur']->id,
                    'wallet_id' => $mandiri->id,
                    'user_id' => $istri->id
                ]);

                // 2. Suami spends on Bensin (weekly, e.g. Rp 100,000)
                Transaction::create([
                    'date' => $firstOfMonth->copy()->day(4 + $dayOfWeekOffset)->format('Y-m-d'),
                    'description' => "Isi Pertamax Motor & Mobil - Minggu " . $week,
                    'amount' => 120000,
                    'type' => 'expense',
                    'category_id' => $catModels['Bensin']->id,
                    'wallet_id' => $bca->id,
                    'user_id' => $suami->id
                ]);

                // 3. Makan Keluarga (weekly, e.g. Rp 300,000 - Rp 450,000)
                $makanAmt = 350000 + rand(-50000, 50000);
                Transaction::create([
                    'date' => $firstOfMonth->copy()->day(5 + $dayOfWeekOffset)->format('Y-m-d'),
                    'description' => "Makan Bersama Akhir Pekan - Minggu " . $week,
                    'amount' => $makanAmt,
                    'type' => 'expense',
                    'category_id' => $catModels['Makan']->id,
                    'wallet_id' => $tunai->id,
                    'user_id' => $istri->id
                ]);

                // 4. Jajan (weekly, e.g. Rp 50,000)
                Transaction::create([
                    'date' => $firstOfMonth->copy()->day(6 + $dayOfWeekOffset)->format('Y-m-d'),
                    'description' => "Uang Jajan - Minggu " . $week,
                    'amount' => 60000,
                    'type' => 'expense',
                    'category_id' => $catModels['Jajan']->id,
                    'wallet_id' => $tunai->id,
                    'user_id' => $suami->id
                ]);
            }
        }

        // 4. Update Wallet Balances to match transaction aggregates + add a baseline starting balance
        // To make sure wallets are not empty or negative, we add a starting balance to the wallets
        $bcaStarting = 12000000; // Starting BCA balance
        $mandiriStarting = 4000000; // Starting Mandiri balance
        $tunaiStarting = 1500000; // Starting Cash

        $bcaIncomes = Transaction::where('wallet_id', $bca->id)->where('type', 'income')->sum('amount');
        $bcaExpenses = Transaction::where('wallet_id', $bca->id)->where('type', 'expense')->sum('amount');
        $bca->balance = $bcaStarting + $bcaIncomes - $bcaExpenses;
        $bca->save();

        $mandiriIncomes = Transaction::where('wallet_id', $mandiri->id)->where('type', 'income')->sum('amount');
        $mandiriExpenses = Transaction::where('wallet_id', $mandiri->id)->where('type', 'expense')->sum('amount');
        $mandiri->balance = $mandiriStarting + $mandiriIncomes - $mandiriExpenses;
        $mandiri->save();

        $tunaiIncomes = Transaction::where('wallet_id', $tunai->id)->where('type', 'income')->sum('amount');
        $tunaiExpenses = Transaction::where('wallet_id', $tunai->id)->where('type', 'expense')->sum('amount');
        $tunai->balance = $tunaiStarting + $tunaiIncomes - $tunaiExpenses;
        $tunai->save();

        // 5. Pre-calculate and cache dashboard metrics so first load is instant
        $analyticsService = new \App\Services\DashboardAnalyticsService();
        $analyticsService->calculateAndCache();
    }
}
