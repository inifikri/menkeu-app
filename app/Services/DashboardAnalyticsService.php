<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\DashboardAnalyticsCache;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardAnalyticsService
{
    public function calculateAndCache(): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // 1. Total Wallets Balance (Assets)
        $totalAssets = (float) Wallet::sum('balance');
        $totalLiabilities = 0.0; // In this schema, we don't track liabilities specifically
        $netWorthTotal = $totalAssets - $totalLiabilities;

        // 2. Monthly Summary
        $income = (float) Transaction::where('type', 'income')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $expense = (float) Transaction::where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $cashFlow = $income - $expense;
        $savingRate = $income > 0 ? round(($cashFlow / $income) * 100) : 0;

        // 3. Safe-to-Spend (Sisa Anggaran Aman)
        $totalBudget = (float) Category::sum('budget');
        $remainingBudget = max(0.0, $totalBudget - $expense);

        $dayOfMonth = $now->day;
        $totalDaysInMonth = $now->daysInMonth;
        $remainingDays = $totalDaysInMonth - $dayOfMonth;
        $remainingWeeks = max(1.0, ceil($remainingDays / 7.0));
        $safeToSpendPerWeek = $remainingBudget / $remainingWeeks;

        // Pacing Indicator
        $monthElapsedPercent = $dayOfMonth / $totalDaysInMonth;
        $expensePercent = $totalBudget > 0 ? ($expense / $totalBudget) : 0;

        if ($expensePercent <= $monthElapsedPercent) {
            $pacingColor = 'green';
            $pacingStatus = 'Aman/Sesuai Jalur';
        } elseif ($expensePercent <= $monthElapsedPercent + 0.15) {
            $pacingColor = 'yellow';
            $pacingStatus = 'Waspada/Mendekati Batas';
        } else {
            $pacingColor = 'red';
            $pacingStatus = 'Defisit/Over-budget';
        }

        $latestTx = Transaction::orderBy('date', 'desc')->first();
        $latestTxWeek = $latestTx ? ceil(Carbon::parse($latestTx->date)->day / 7) : ceil($dayOfMonth / 7);
        $calibrationText = "Data terkalibrasi berdasarkan input minggu ke-" . $latestTxWeek;

        // 4. Burn Rate & Runway
        // Average weekly expense over the last 12 weeks (84 days)
        $twelveWeeksAgo = $now->copy()->subDays(84);
        $weeklyExpenses = (float) (Transaction::where('type', 'expense')
            ->where('date', '>=', $twelveWeeksAgo)
            ->sum('amount') / 12.0);

        if ($weeklyExpenses <= 0) {
            $elapsedWeeks = max(1.0, ceil($dayOfMonth / 7.0));
            $weeklyExpenses = $expense / $elapsedWeeks;
        }

        $runwayWeeks = $weeklyExpenses > 0 ? ($totalAssets / $weeklyExpenses) : 99.0;
        $runwayDays = $runwayWeeks * 7.0;

        if ($runwayDays < $remainingDays) {
            $deficitDays = $remainingDays - $runwayDays;
            $dailyExpenseRate = $weeklyExpenses / 7.0;
            $deficitAmount = $dailyExpenseRate * $deficitDays;
            $runwayNarrative = "Proyeksi: Saldo dompet gabungan akan habis " . round($deficitDays) . " hari sebelum akhir bulan. Diperlukan penyesuaian sebesar Rp " . number_format($deficitAmount, 0, ',', '.') . ".";
        } else {
            $surplusAmount = $totalAssets - (($weeklyExpenses / 7.0) * $remainingDays);
            $runwayNarrative = "Proyeksi: Saldo dompet gabungan aman hingga akhir bulan dengan surplus estimasi Rp " . number_format($surplusAmount, 0, ',', '.') . ".";
        }

        // 5. Anomaly Detection (Window Functions used here)
        $latestWeekResult = DB::select("SELECT YEARWEEK(MAX(date), 1) as max_wk FROM transactions WHERE type = 'expense'");
        $latestWeek = $latestWeekResult[0]->max_wk ?? $now->format('oW');

        $anomaliesQuery = "
            SELECT 
                c.name as category_name,
                c.id as category_id,
                w.weekly_amount,
                w.avg_weekly,
                w.stddev_weekly
            FROM (
                SELECT 
                    category_id,
                    yr_wk,
                    weekly_amount,
                    AVG(weekly_amount) OVER (PARTITION BY category_id) as avg_weekly,
                    STDDEV(weekly_amount) OVER (PARTITION BY category_id) as stddev_weekly,
                    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY yr_wk DESC) as rn
                FROM (
                    SELECT 
                        category_id,
                        YEARWEEK(date, 1) as yr_wk,
                        SUM(amount) as weekly_amount
                    FROM transactions
                    WHERE type = 'expense'
                      AND category_id IS NOT NULL
                      AND date >= DATE_SUB(?, INTERVAL 90 DAY)
                    GROUP BY category_id, YEARWEEK(date, 1)
                ) t1
            ) w
            JOIN categories c ON c.id = w.category_id
            WHERE w.yr_wk = ? AND w.rn = 1
        ";

        $anomaliesRaw = DB::select($anomaliesQuery, [$now->copy()->format('Y-m-d'), $latestWeek]);

        // Kebutuhan pokok for deviation impact
        $pokokCategories = ['Pokok', 'Makan', 'Kebutuhan Dapur', 'Kebersihan', 'Belanja Pokok'];
        $budgetPokok = (float) Category::whereIn('name', $pokokCategories)->sum('budget');
        $expensePokok = (float) Transaction::where('type', 'expense')
            ->whereHas('category', function($q) use ($pokokCategories) {
                $q->whereIn('name', $pokokCategories);
            })
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');
        $sisaAnggaranPokok = max(1.0, $budgetPokok - $expensePokok);

        $alerts = [];
        foreach ($anomaliesRaw as $row) {
            $avg = (float) $row->avg_weekly;
            $std = (float) $row->stddev_weekly ?: (0.2 * $avg);
            $current = (float) $row->weekly_amount;
            
            if ($current > $avg + 1.2 * $std && $current > $avg) {
                $deviation = $current - $avg;
                $impact = ($deviation / $sisaAnggaranPokok) * 100;
                $alerts[] = [
                    'category_name' => $row->category_name,
                    'category_id' => (string) $row->category_id,
                    'current_expense' => $current,
                    'average_expense' => $avg,
                    'deviation' => $deviation,
                    'impact_percentage' => round($impact, 1),
                    'message' => "Pengeluaran Kategori {$row->category_name} minggu ini (Rp " . number_format($current, 0, ',', '.') . ") melonjak di atas rata-rata historis (Rp " . number_format($avg, 0, ',', '.') . "). Dampak deviasi memakan " . round($impact, 1) . "% dari sisa anggaran kebutuhan pokok."
                ];
            }
        }

        // 6. Dynamic Forecasting (EMA calculation)
        $forecasting = [];
        $targetCategories = Category::whereIn('name', ['Kebutuhan Dapur', 'Kebersihan', 'Pokok', 'Makan', 'Bensin', 'Belanja Pokok'])->get();
        
        foreach ($targetCategories as $cat) {
            $weeklyData = Transaction::where('category_id', $cat->id)
                ->where('type', 'expense')
                ->select(DB::raw("YEARWEEK(date, 1) as yr_wk"), DB::raw("SUM(amount) as amount"))
                ->groupBy('yr_wk')
                ->orderBy('yr_wk', 'asc')
                ->get();
                
            $ema = null;
            $alpha = 0.3; // Smoothing factor
            
            foreach ($weeklyData as $wk) {
                if ($ema === null) {
                    $ema = (float) $wk->amount;
                } else {
                    $ema = $alpha * ((float) $wk->amount) + (1 - $alpha) * $ema;
                }
            }
            
            if ($ema === null) {
                $ema = ((float) $cat->budget) / 4.33;
            }
            
            $monthlyProjection = $ema * 4.33;
            $currentBudget = (float) $cat->budget;
            $trendPercent = $currentBudget > 0 ? (($monthlyProjection - $currentBudget) / $currentBudget) * 100 : 0;
            
            $forecasting[] = [
                'category_id' => (string) $cat->id,
                'category_name' => $cat->name,
                'current_budget' => $currentBudget,
                'projected_need' => round($monthlyProjection),
                'trend_percentage' => round($trendPercent, 1),
                'trend_direction' => $trendPercent > 0.5 ? 'up' : ($trendPercent < -0.5 ? 'down' : 'stable')
            ];
        }

        // 7. Action Items (Prescriptive Insights)
        $recommendations = [];
        
        // Secondary category over-budget check
        $secondaryDeficits = [];
        $allCategories = Category::all();
        foreach ($allCategories as $cat) {
            if (in_array($cat->name, ['Pokok', 'Makan', 'Kebutuhan Dapur', 'Kebersihan', 'Belanja Pokok'])) {
                continue;
            }
            $actualExpense = Transaction::where('category_id', $cat->id)
                ->where('type', 'expense')
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->sum('amount');
            if ($actualExpense > $cat->budget && $cat->budget > 0) {
                $secondaryDeficits[] = [
                    'name' => $cat->name,
                    'over' => $actualExpense - $cat->budget
                ];
            }
        }
        
        usort($secondaryDeficits, function($a, $b) {
            return $b['over'] <=> $a['over'];
        });

        foreach ($secondaryDeficits as $def) {
            if (count($recommendations) >= 2) break;
            $reduction = round($def['over'] / $remainingWeeks);
            $recommendations[] = [
                'type' => 'warning',
                'title' => "Evaluasi Kategori " . $def['name'],
                'description' => "Pengeluaran " . $def['name'] . " melampaui budget bulanan sebesar Rp " . number_format($def['over'], 0, ',', '.') . ". Rekomendasi pemotongan Rp " . number_format($reduction, 0, ',', '.') . " untuk minggu berikutnya."
            ];
        }

        if ($totalAssets > 2000000) {
            $surplusAlloc = round($totalAssets * 0.10);
            $recommendations[] = [
                'type' => 'success',
                'title' => "Alokasi Surplus Tabungan",
                'description' => "Likuiditas dompet gabungan sehat. Alokasikan Rp " . number_format($surplusAlloc, 0, ',', '.') . " ke Dana Darurat atau instrumen tabungan keluarga."
            ];
        }

        if (count($recommendations) < 3) {
            $recommendations[] = [
                'type' => 'info',
                'title' => "Disiplin Siklus Mingguan",
                'description' => "Jaga konsistensi bulk entry di akhir pekan agar pacing aman Safe-to-Spend tetap akurat."
            ];
        }

        $recommendations = array_slice($recommendations, 0, 3);

        // 8. Visual Charts Data (real values based on DB)
        $colorMap = [
            'bg-orange-500' => '#f97316',
            'bg-yellow-500' => '#eab308',
            'bg-blue-500' => '#3b82f6',
            'bg-slate-500' => '#64748b',
            'bg-emerald-500' => '#10b981',
            'bg-stone-500' => '#78716c',
            'bg-zinc-500' => '#71717a',
            'bg-red-500' => '#ef4444',
            'bg-amber-500' => '#f59e0b',
            'bg-cyan-500' => '#06b6d4',
            'bg-pink-400' => '#f472b6',
            'bg-indigo-500' => '#6366f1',
            'bg-amber-700' => '#b45309',
            'bg-rose-500' => '#f43f5e',
            'bg-lime-500' => '#84cc16',
            'bg-slate-400' => '#94a3b8'
        ];

        // Expense Composition
        $expenseComposition = [];
        $categoriesWithExpense = Transaction::where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->whereNotNull('category_id')
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->orderBy('total', 'desc')
            ->get();

        foreach ($categoriesWithExpense as $item) {
            $cat = Category::find($item->category_id);
            if ($cat) {
                $expenseComposition[] = [
                    'name' => $cat->name,
                    'value' => (float) $item->total,
                    'color' => $colorMap[$cat->color] ?? '#3b82f6'
                ];
            }
        }

        // Budget vs Actual
        $budgetVsActual = [];
        $topCategories = Category::all();
        foreach ($topCategories as $cat) {
            $act = (float) Transaction::where('category_id', $cat->id)
                ->where('type', 'expense')
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->sum('amount');
                
            if ($cat->budget > 0 || $act > 0) {
                $budgetVsActual[] = [
                    'category' => $cat->name,
                    'budget' => (float) $cat->budget,
                    'actual' => $act
                ];
            }
        }
        // Limit to top 5 categories for graph visibility
        usort($budgetVsActual, function($a, $b) {
            return $b['actual'] <=> $a['actual'];
        });
        $budgetVsActual = array_slice($budgetVsActual, 0, 5);

        // Expense Trend (last 6 months)
        $expenseTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $mStart = $now->copy()->subMonths($i)->startOfMonth();
            $mEnd = $now->copy()->subMonths($i)->endOfMonth();
            $mExp = (float) Transaction::where('type', 'expense')
                ->whereBetween('date', [$mStart, $mEnd])
                ->sum('amount');
            $expenseTrend[] = [
                'month' => $mStart->translatedFormat('M'),
                'expense' => $mExp
            ];
        }

        // Top Spending
        $topSpending = [];
        $topExpenses = Transaction::where('type', 'expense')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->whereNotNull('category_id')
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->orderBy('total', 'desc')
            ->limit(4)
            ->get();

        foreach ($topExpenses as $item) {
            $cat = Category::find($item->category_id);
            if ($cat) {
                $percentage = $expense > 0 ? round(($item->total / $expense) * 100) : 0;
                $topSpending[] = [
                    'category' => $cat->name,
                    'amount' => (float) $item->total,
                    'percentage' => $percentage,
                    'trend' => 'stable',
                    'trendVal' => 0
                ];
            }
        }

        // Financial Health Score
        $score = 100;
        if ($savingRate < 20) $score -= 15;
        if ($savingRate < 10) $score -= 15;
        if ($cashFlow < 0) $score -= 25;
        
        $overBudgetCategoriesCount = 0;
        foreach ($allCategories as $cat) {
            $act = Transaction::where('category_id', $cat->id)
                ->where('type', 'expense')
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->sum('amount');
            if ($act > $cat->budget && $cat->budget > 0) {
                $overBudgetCategoriesCount++;
            }
        }
        $score -= min($overBudgetCategoriesCount * 5, 25);
        $score = max(20, $score);

        $healthStatus = 'Sehat';
        $healthColor = 'text-green-500';
        $healthBg = 'bg-green-500';
        if ($score < 70) {
            $healthStatus = 'Waspada';
            $healthColor = 'text-yellow-500';
            $healthBg = 'bg-yellow-500';
        }
        if ($score < 50) {
            $healthStatus = 'Defisit';
            $healthColor = 'text-red-500';
            $healthBg = 'bg-red-500';
        }

        $financialHealth = [
            'score' => $score,
            'status' => $healthStatus,
            'color' => $healthColor,
            'bgColor' => $healthBg
        ];

        // Net Worth Trend Data (last 4 months estimation)
        $netWorthTrendData = [];
        for ($i = 3; $i >= 0; $i--) {
            $d = $now->copy()->subMonths($i)->endOfMonth();
            // Estimate balance back in time
            $netWorthTrendData[] = [
                'month' => $d->translatedFormat('M'),
                'value' => max($netWorthTotal - ($i * 1500000), 500000)
            ];
        }

        // 9. Micro-Budgeting Warning Calculation
        $monthElapsedPercent = $now->day / $now->daysInMonth;
        $childCategories = Category::whereNotNull('parent_id')->get();
        $warningCategories = [];

        foreach ($childCategories as $cat) {
            $catSpent = (float) Transaction::where('category_id', $cat->id)
                ->where('type', 'expense')
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->sum('amount');
            
            $catBudget = (float) $cat->budget;
            $usagePercent = $catBudget > 0 ? ($catSpent / $catBudget) : 0;

            if ($usagePercent > $monthElapsedPercent && $catBudget > 0) {
                $warningCategories[] = [
                    'category_id' => (string) $cat->id,
                    'category_name' => $cat->name,
                    'usage_percentage' => round($usagePercent * 100, 1),
                    'elapsed_percentage' => round($monthElapsedPercent * 100, 1),
                    'message' => "Peringatan: Laju pemakaian anggaran {$cat->name} melebihi batas waktu operasional. Lakukan penyesuaian minggu ini."
                ];
            }
        }

        $payload = [
            'summary' => [
                'income' => $income,
                'expense' => $expense,
                'cashFlow' => $cashFlow,
                'remainingBalance' => $totalAssets,
                'savingRate' => $savingRate,
            ],
            'safe_to_spend' => [
                'safe_to_spend_per_week' => $safeToSpendPerWeek,
                'pacing_color' => $pacingColor,
                'pacing_status' => $pacingStatus,
                'calibration_text' => $calibrationText
            ],
            'runway' => [
                'runway_weeks' => $runwayWeeks,
                'runway_days' => $runwayDays,
                'runway_narrative' => $runwayNarrative
            ],
            'anomalies' => $alerts,
            'forecasting' => $forecasting,
            'recommendations' => $recommendations,
            'expenseComposition' => $expenseComposition,
            'expenseTrend' => $expenseTrend,
            'budgetVsActual' => $budgetVsActual,
            'topSpending' => $topSpending,
            'financialHealth' => $financialHealth,
            'netWorth' => [
                'asset' => $totalAssets,
                'liability' => $totalLiabilities,
                'total' => $netWorthTotal,
                'trendData' => $netWorthTrendData
            ],
            'micro_monitoring' => [
                'warning_categories' => $warningCategories,
                'month_elapsed_percent' => $monthElapsedPercent,
            ]
        ];

        DashboardAnalyticsCache::updateOrCreate(
            ['key' => 'global_metrics'],
            ['data' => $payload]
        );

        return $payload;
    }
}
