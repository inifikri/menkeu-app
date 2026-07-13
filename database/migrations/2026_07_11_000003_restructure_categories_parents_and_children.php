<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Category;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Buat 5 Kategori Induk Baru
        $parentsInfo = [
            'Kebutuhan Pokok' => ['priority' => 1, 'icon' => 'Home', 'color' => 'bg-emerald-500'],
            'Transportasi & Kerja' => ['priority' => 2, 'icon' => 'Car', 'color' => 'bg-blue-500'],
            'Kebutuhan Pendukung' => ['priority' => 3, 'icon' => 'Settings', 'color' => 'bg-purple-500'],
            'Kesehatan & Perawatan' => ['priority' => 4, 'icon' => 'HeartPulse', 'color' => 'bg-pink-400'],
            'Gaya Hidup & Konsumtif' => ['priority' => 5, 'icon' => 'Sparkles', 'color' => 'bg-orange-500'],
        ];

        $parents = [];
        foreach ($parentsInfo as $name => $info) {
            $parents[$name] = Category::firstOrCreate(
                ['name' => $name],
                [
                    'priority_level' => $info['priority'],
                    'icon' => $info['icon'],
                    'color' => $info['color'],
                    'budget' => 0.0,
                    'parent_id' => null,
                ]
            );
            // Pastikan priority_level dan parent_id benar jika sudah ada
            $parents[$name]->update([
                'priority_level' => $info['priority'],
                'parent_id' => null
            ]);
        }

        // 2. Hubungkan Kategori Rill (Anak) ke Kategori Induk Baru & Sesuaikan Priority Level
        $childMapping = [
            'Makan' => ['parent' => 'Kebutuhan Pokok', 'priority' => 1],
            'Kebutuhan Dapur' => ['parent' => 'Kebutuhan Pokok', 'priority' => 1],
            'Pokok' => ['parent' => 'Kebutuhan Pokok', 'priority' => 1],
            
            'Bensin' => ['parent' => 'Transportasi & Kerja', 'priority' => 2],
            'Penitipan Motor' => ['parent' => 'Transportasi & Kerja', 'priority' => 2],
            'Kartu KRL' => ['parent' => 'Transportasi & Kerja', 'priority' => 2],
            'Permotoran' => ['parent' => 'Transportasi & Kerja', 'priority' => 2],
            
            'Kuota' => ['parent' => 'Kebutuhan Pendukung', 'priority' => 3],
            'Kebersihan' => ['parent' => 'Kebutuhan Pendukung', 'priority' => 3],
            'Lainnya' => ['parent' => 'Kebutuhan Pendukung', 'priority' => 3],
            
            'Skincare & Bodycare' => ['parent' => 'Kesehatan & Perawatan', 'priority' => 4],
            'Buah-buahan' => ['parent' => 'Kesehatan & Perawatan', 'priority' => 4],
            
            'Jajan' => ['parent' => 'Gaya Hidup & Konsumtif', 'priority' => 5],
            'Ngopi' => ['parent' => 'Gaya Hidup & Konsumtif', 'priority' => 5],
            'Rokok' => ['parent' => 'Gaya Hidup & Konsumtif', 'priority' => 5],
            'Piutang' => ['parent' => 'Gaya Hidup & Konsumtif', 'priority' => 5],
        ];

        foreach ($childMapping as $name => $info) {
            $parentCategory = $parents[$info['parent']] ?? null;
            if ($parentCategory) {
                Category::where('name', $name)->update([
                    'parent_id' => $parentCategory->id,
                    'priority_level' => $info['priority']
                ]);
            }
        }
    }

    public function down(): void
    {
        // Kembalikan semua parent_id ke null
        Category::query()->update(['parent_id' => null]);
        // Hapus kategori induk yang dibuat
        Category::whereIn('name', [
            'Kebutuhan Pokok',
            'Transportasi & Kerja',
            'Kebutuhan Pendukung',
            'Kesehatan & Perawatan',
            'Gaya Hidup & Konsumtif'
        ])->forceDelete();
    }
};
