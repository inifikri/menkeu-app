<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Wallet;
use Illuminate\Support\Facades\Log;

class WaterfallAllocationService
{
    /**
     * Run the waterfall allocation calculation and update category budgets.
     * Returns the allocation details.
     */
    public function allocate(): array
    {
        // 1. Ambil Dompet Utama
        $dompetUtama = Wallet::where('is_utama', true)->first();
        $totalIncome = $dompetUtama ? (float) $dompetUtama->balance : 0.0;

        // 2. Ambil semua kategori aktif
        $categories = Category::all();

        // 3. Hitung total budget untuk level 1 hingga 4
        $level1Budget = (float) Category::where('priority_level', 1)->sum('budget');
        $level2Budget = (float) Category::where('priority_level', 2)->sum('budget');
        $level3Budget = (float) Category::where('priority_level', 3)->sum('budget');
        $level4Budget = (float) Category::where('priority_level', 4)->sum('budget');

        $totalBudget1to4 = $level1Budget + $level2Budget + $level3Budget + $level4Budget;

        // 4. Hitung Sisa Dana
        $sisaDana = max(0.0, $totalIncome - $totalBudget1to4);

        // 5. Update budget Kategori Level 5 secara otomatis
        $level5Categories = Category::where('priority_level', 5)->get();
        $level5Count = $level5Categories->count();

        if ($level5Count > 0) {
            // Bagi sisa dana secara merata ke kategori level 5
            $budgetPerCategory5 = $sisaDana / $level5Count;
            foreach ($level5Categories as $cat) {
                $cat->budget = $budgetPerCategory5;
                $cat->save();
            }
        }

        // Return detail untuk diproses atau di-log
        return [
            'total_income' => $totalIncome,
            'level_1_budget' => $level1Budget,
            'level_2_budget' => $level2Budget,
            'level_3_budget' => $level3Budget,
            'level_4_budget' => $level4Budget,
            'total_level_1_4' => $totalBudget1to4,
            'sisa_dana_level_5' => $sisaDana,
            'level_5_categories_count' => $level5Count,
        ];
    }
}
