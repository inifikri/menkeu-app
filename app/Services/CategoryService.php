<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Wallet;
use App\Services\DashboardAnalyticsService;
use Illuminate\Validation\ValidationException;

class CategoryService
{
    protected $analyticsService;

    public function __construct(DashboardAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Create a new category after validating the waterfall allocation budget.
     */
    public function createCategory(array $data): Category
    {
        $this->validateWaterfallAllocation($data['budget'], $data['priority_level'] ?? null);

        $category = Category::create($data);

        $this->analyticsService->calculateAndCache();

        return $category;
    }

    /**
     * Update an existing category after validating the waterfall allocation budget.
     */
    public function updateCategory(Category $category, array $data): Category
    {
        $this->validateWaterfallAllocation($data['budget'], $data['priority_level'] ?? null, $category->id);

        $category->update($data);

        $this->analyticsService->calculateAndCache();

        return $category;
    }

    /**
     * Delete a category and update analytics cache.
     */
    public function deleteCategory(Category $category): void
    {
        $category->delete();
        $this->analyticsService->calculateAndCache();
    }

    /**
     * Validate that level 5 budget does not exceed the allowed waterfall allocation limit.
     *
     * @throws ValidationException
     */
    protected function validateWaterfallAllocation(float $budget, ?int $priorityLevel, ?int $excludeId = null): void
    {
        if ($priorityLevel === 5) {
            $dompetUtama = Wallet::where('is_utama', true)->first();
            $totalIncome = $dompetUtama ? (float) $dompetUtama->balance : 0.0;

            $query = Category::whereBetween('priority_level', [1, 4]);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            $totalBudget1to4 = (float) $query->sum('budget');

            $maxAllowedBudget5 = max(0.0, $totalIncome - $totalBudget1to4);

            if ($budget > $maxAllowedBudget5) {
                throw ValidationException::withMessages([
                    'budget' => 'Anggaran Level 5 melebihi batas Waterfall Allocation yang diizinkan (Maks: Rp ' . number_format($maxAllowedBudget5, 0, ',', '.') . ').'
                ]);
            }
        }
    }
}
