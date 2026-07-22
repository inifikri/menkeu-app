<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\BudgetSnapshot;
use App\Services\WaterfallAllocationService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class BudgetingModulTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app['config']->set('database.default', 'mysql');
        $this->app['config']->set('database.connections.mysql.database', 'mkeuangan_db');
        $this->app['config']->set('database.connections.mysql.username', 'root');
        $this->app['config']->set('database.connections.mysql.password', 'Password');
    }

    public function test_category_parent_children_relationship()
    {
        $parent = Category::create([
            'name' => 'Parent Cat',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 1000000,
            'priority_level' => 1
        ]);

        $child = Category::create([
            'name' => 'Child Cat',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 500000,
            'parent_id' => $parent->id,
            'priority_level' => 2
        ]);

        $this->assertEquals($parent->id, $child->parent->id);
        $this->assertCount(1, $parent->children);
        $this->assertEquals($child->id, $parent->children->first()->id);
    }

    public function test_waterfall_allocation_service()
    {
        // Clear existing wallets to avoid conflicts
        Wallet::query()->delete();

        // 1. Setup Wallet Utama
        $wallet = Wallet::create([
            'name' => 'Dompet Utama Test',
            'balance' => 5000000,
            'type' => 'Tunai',
            'is_utama' => true
        ]);

        // 2. Setup Categories with Priority Levels
        Category::query()->delete();

        $cat1 = Category::create([
            'name' => 'Cat P1',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 1500000,
            'priority_level' => 1
        ]);

        $cat2 = Category::create([
            'name' => 'Cat P2',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 1000000,
            'priority_level' => 2
        ]);

        $cat5 = Category::create([
            'name' => 'Cat P5',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 0,
            'priority_level' => 5
        ]);

        $service = new WaterfallAllocationService();
        $result = $service->allocate();

        // Total budget level 1 to 4 is 1.5M + 1M = 2.5M
        // Sisa Dana = 5M - 2.5M = 2.5M
        // Cat P5 budget should be updated to 2.5M
        $cat5->refresh();
        $this->assertEquals(2500000, (float) $cat5->budget);
        $this->assertEquals(2500000, $result['sisa_dana_level_5']);
    }

    public function test_api_blocks_manual_priority_level_5_budget_exceeding_waterfall_limit()
    {
        // Clear existing wallets to avoid conflicts
        Wallet::query()->delete();

        $user = User::factory()->create();
        $this->actingAs($user);

        // Setup Dompet Utama
        $wallet = Wallet::create([
            'name' => 'Dompet Utama Test',
            'balance' => 4000000, // 4M total income
            'type' => 'Tunai',
            'is_utama' => true,
            'user_id' => $user->id
        ]);

        // Setup categories
        Category::query()->delete();

        $cat1 = Category::create([
            'name' => 'Cat P1',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 3000000, // 3M used by P1
            'priority_level' => 1
        ]);

        // Max allowed for level 5: 4M - 3M = 1M
        $cat5 = Category::create([
            'name' => 'Cat P5',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 100000,
            'priority_level' => 5
        ]);

        // Try to update level 5 to 1.5M (exceeds 1M remaining) - should be blocked
        $response = $this->put("/categories/{$cat5->id}", [
            'name' => 'Cat P5 Updated',
            'icon' => 'Grid',
            'color' => 'bg-blue-500',
            'budget' => 1500000,
            'priority_level' => 5
        ]);

        $response->assertSessionHasErrors('budget');
    }

    public function test_close_month_calculates_correct_accuracy()
    {
        // Clear existing wallets to avoid conflicts
        Wallet::query()->delete();

        $user = User::factory()->create();
        $this->actingAs($user);

        // Setup categories
        Category::query()->delete();

        $cat = Category::create([
            'name' => 'Food',
            'icon' => 'Grid',
            'color' => 'bg-orange-500',
            'budget' => 2000000,
            'priority_level' => 1
        ]);

        $wallet = Wallet::create([
            'name' => 'Wallet',
            'balance' => 5000000,
            'type' => 'Tunai',
            'is_utama' => true
        ]);

        // Create transaction of 1.5M (budget is 2M, deviance is 500K -> accuracy is 75%)
        Transaction::create([
            'date' => '2026-07-10',
            'description' => 'Grocery',
            'amount' => 1500000,
            'type' => 'expense',
            'category_id' => $cat->id,
            'wallet_id' => $wallet->id,
            'user_id' => $user->id
        ]);

        $response = $this->post('/budget/close-month', [
            'month' => '2026-07'
        ]);

        $response->assertStatus(200);

        // Check snapshot is created
        $snapshot = BudgetSnapshot::where('month', '2026-07')->where('category_id', $cat->id)->first();
        $this->assertNotNull($snapshot);
        $this->assertEquals(2000000, (float) $snapshot->budget);
        $this->assertEquals(1500000, (float) $snapshot->spent);
        $this->assertEquals(75.00, (float) $snapshot->accuracy);
    }
}
