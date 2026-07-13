<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\Category;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Definisikan Prioritas & Hubungan Parent-Child
        // Priority 1: Pokok (Parent), Makan (Child), Kebutuhan Dapur (Child)
        // Priority 2: Permotoran (Parent), Bensin (Child), Penitipan Motor (Child)
        // Priority 3: Kuota, Kebersihan
        // Priority 4: Skincare & Bodycare, Buah-buahan
        // Priority 5: Jajan (Parent), Rokok (Child), Ngopi (Child), Lainnya, Piutang
        
        // Buat atau Update kategori utama terlebih dahulu agar parent_id valid
        $categoryMapping = [
            'Pokok' => ['priority' => 1, 'parent' => null],
            'Makan' => ['priority' => 1, 'parent' => 'Pokok'],
            'Kebutuhan Dapur' => ['priority' => 1, 'parent' => 'Pokok'],
            
            'Permotoran' => ['priority' => 2, 'parent' => null],
            'Bensin' => ['priority' => 2, 'parent' => 'Permotoran'],
            'Penitipan Motor' => ['priority' => 2, 'parent' => 'Permotoran'],
            'Kartu KRL' => ['priority' => 2, 'parent' => null],
            
            'Kuota' => ['priority' => 3, 'parent' => null],
            'Kebersihan' => ['priority' => 3, 'parent' => 'Pokok'],
            
            'Skincare & Bodycare' => ['priority' => 4, 'parent' => null],
            'Buah-buahan' => ['priority' => 4, 'parent' => null],
            
            'Jajan' => ['priority' => 5, 'parent' => null],
            'Ngopi' => ['priority' => 5, 'parent' => 'Jajan'],
            'Rokok' => ['priority' => 5, 'parent' => 'Jajan'],
            'Piutang' => ['priority' => 5, 'parent' => null],
            'Lainnya' => ['priority' => 5, 'parent' => null],
        ];

        // Pertama: Update semua priority level
        foreach ($categoryMapping as $name => $info) {
            DB::table('categories')
                ->where('name', $name)
                ->update(['priority_level' => $info['priority']]);
        }

        // Kedua: Hubungkan Parent dan Child
        foreach ($categoryMapping as $name => $info) {
            if ($info['parent'] !== null) {
                $parent = Category::where('name', $info['parent'])->first();
                if ($parent) {
                    Category::where('name', $name)->update(['parent_id' => $parent->id]);
                }
            }
        }
    }

    public function down(): void
    {
        DB::table('categories')->update([
            'parent_id' => null,
            'priority_level' => 5
        ]);
    }
};
