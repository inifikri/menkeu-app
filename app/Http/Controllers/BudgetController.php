<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\BudgetSnapshot;
use App\Services\WaterfallAllocationService;
use App\Services\DashboardAnalyticsService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BudgetController extends Controller
{
    public function runWaterfall(Request $request)
    {
        $service = new WaterfallAllocationService();
        $result = $service->allocate();

        // Recalculate dashboard cache
        $analyticsService = new DashboardAnalyticsService();
        $analyticsService->calculateAndCache();

        return response()->json([
            'status' => 'success',
            'message' => 'Waterfall allocation executed successfully.',
            'data' => $result
        ]);
    }

    public function closeMonth(Request $request)
    {
        $request->validate([
            'month' => 'required|string|regex:/^\d{4}-\d{2}$/'
        ]);

        $monthStr = $request->input('month'); // e.g. "2026-07"
        $parsedMonth = Carbon::createFromFormat('Y-m', $monthStr);
        $startOfMonth = $parsedMonth->copy()->startOfMonth()->format('Y-m-d');
        $endOfMonth = $parsedMonth->copy()->endOfMonth()->format('Y-m-d');

        // Delete existing snapshots for this month to avoid duplicates if rerun
        BudgetSnapshot::where('month', $monthStr)->delete();

        $categories = Category::all();
        $snapshots = [];

        foreach ($categories as $cat) {
            $spent = (float) Transaction::where('category_id', $cat->id)
                ->where('type', 'expense')
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->sum('amount');

            $budget = (float) $cat->budget;

            // Calculate accuracy: max(0, 100 - abs(spent - budget) / budget * 100)
            if ($budget <= 0) {
                $accuracy = $spent == 0 ? 100.0 : 0.0;
            } else {
                $accuracy = max(0.0, 100.0 - (abs($spent - $budget) / $budget) * 100.0);
            }

            $snapshot = BudgetSnapshot::create([
                'month' => $monthStr,
                'category_id' => $cat->id,
                'category_name' => $cat->name,
                'budget' => $budget,
                'spent' => $spent,
                'accuracy' => $accuracy,
                'user_id' => auth()->id()
            ]);

            $snapshots[] = [
                'id' => (string) $snapshot->id,
                'category_name' => $snapshot->category_name,
                'budget' => (float) $snapshot->budget,
                'spent' => (float) $snapshot->spent,
                'accuracy' => (float) $snapshot->accuracy,
            ];
        }

        // Recalculate analytics cache
        $analyticsService = new DashboardAnalyticsService();
        $analyticsService->calculateAndCache();

        return response()->json([
            'status' => 'success',
            'message' => "Bulan {$monthStr} berhasil ditutup. Snapshot akurasi disimpan.",
            'snapshots' => $snapshots
        ]);
    }

    public function getSnapshots(Request $request)
    {
        $snapshots = BudgetSnapshot::orderBy('month', 'desc')->get()->groupBy('month')->map(function($items, $month) {
            return [
                'month' => $month,
                'avg_accuracy' => round($items->avg('accuracy'), 1),
                'total_budget' => (float) $items->sum('budget'),
                'total_spent' => (float) $items->sum('spent'),
                'items' => $items->map(function($i) {
                    return [
                        'category_name' => $i->category_name,
                        'budget' => (float) $i->budget,
                        'spent' => (float) $i->spent,
                        'accuracy' => (float) $i->accuracy,
                    ];
                })
            ];
        })->values();

        return response()->json($snapshots);
    }
}
