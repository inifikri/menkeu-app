<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Illuminate\Support\Facades\Event::fake([
            \App\Events\BulkTransactionsSaved::class
        ]);

        $this->mock(\App\Services\DashboardAnalyticsService::class, function ($mock) {
            $mock->shouldReceive('calculateAndCache')->andReturn([]);
        });
    }

    public function test_standard_user_cannot_manage_users(): void
    {
        $standardUser = User::factory()->create(['role' => 'Anggota']);
        $otherUser = User::factory()->create();

        // 1. Store user should be forbidden
        $response = $this->actingAs($standardUser)->post('/users', [
            'name' => 'New User',
            'email' => 'newuser@email.com',
            'password' => 'password123',
            'role' => 'Anggota',
            'avatarColor' => 'bg-blue-500',
        ]);
        $response->assertStatus(403);

        // 2. Update user should be forbidden
        $response = $this->actingAs($standardUser)->put("/users/{$otherUser->id}", [
            'name' => 'Updated User',
            'role' => 'Anggota',
        ]);
        $response->assertStatus(403);

        // 3. Delete user should be forbidden
        $response = $this->actingAs($standardUser)->delete("/users/{$otherUser->id}");
        $response->assertStatus(403);
    }

    public function test_admin_user_can_manage_users(): void
    {
        $adminUser = User::factory()->create(['role' => 'Administrator']);
        $otherUser = User::factory()->create();

        // 1. Store user
        $response = $this->actingAs($adminUser)->post('/users', [
            'name' => 'New User',
            'email' => 'newuser@email.com',
            'password' => 'password123',
            'role' => 'Anggota',
            'avatarColor' => 'bg-blue-500',
        ]);
        $response->assertStatus(302); // Redirect success

        // 2. Update user
        $response = $this->actingAs($adminUser)->put("/users/{$otherUser->id}", [
            'name' => 'Updated User',
            'role' => 'Anggota',
        ]);
        $response->assertStatus(302);

        // 3. Delete user
        $response = $this->actingAs($adminUser)->delete("/users/{$otherUser->id}");
        $response->assertStatus(302);
    }

    public function test_user_cannot_update_other_users_wallet(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $wallet2 = Wallet::create([
            'name' => 'Wallet 2',
            'balance' => 1000,
            'type' => 'Bank',
            'user_id' => $user2->id,
            'is_utama' => false,
        ]);

        $response = $this->actingAs($user1)->put("/wallets/{$wallet2->id}", [
            'name' => 'Hacked Wallet',
            'type' => 'Bank',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_update_own_wallet(): void
    {
        $user = User::factory()->create();

        $wallet = Wallet::create([
            'name' => 'My Wallet',
            'balance' => 1000,
            'type' => 'Bank',
            'user_id' => $user->id,
            'is_utama' => false,
        ]);

        $response = $this->actingAs($user)->put("/wallets/{$wallet->id}", [
            'name' => 'My Wallet Updated',
            'type' => 'Bank',
        ]);

        $response->assertStatus(302);
        $this->assertEquals('My Wallet Updated', $wallet->fresh()->name);
    }

    public function test_user_cannot_update_or_delete_other_users_transaction(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $wallet2 = Wallet::create([
            'name' => 'Wallet 2',
            'balance' => 1000,
            'type' => 'Bank',
            'user_id' => $user2->id,
            'is_utama' => false,
        ]);

        $transaction2 = Transaction::create([
            'date' => '2026-07-22',
            'description' => 'Tx 2',
            'amount' => 500,
            'type' => 'expense',
            'wallet_id' => $wallet2->id,
            'user_id' => $user2->id,
        ]);

        // 1. Update other user's transaction should fail
        $response = $this->actingAs($user1)->put("/transactions/{$transaction2->id}", [
            'date' => '2026-07-22',
            'description' => 'Hacked Tx',
            'amount' => 500,
            'type' => 'expense',
            'wallet_id' => $wallet2->id,
            'user_id' => $user2->id,
        ]);
        $response->assertStatus(403);

        // 2. Delete other user's transaction should fail
        $response = $this->actingAs($user1)->delete("/transactions/{$transaction2->id}");
        $response->assertStatus(403);
    }

    public function test_user_can_update_and_delete_own_transaction(): void
    {
        $user = User::factory()->create();

        $wallet = Wallet::create([
            'name' => 'Wallet',
            'balance' => 1000,
            'type' => 'Bank',
            'user_id' => $user->id,
            'is_utama' => false,
        ]);

        $transaction = Transaction::create([
            'date' => '2026-07-22',
            'description' => 'My Tx',
            'amount' => 500,
            'type' => 'expense',
            'wallet_id' => $wallet->id,
            'user_id' => $user->id,
        ]);

        // 1. Update own transaction
        $response = $this->actingAs($user)->put("/transactions/{$transaction->id}", [
            'date' => '2026-07-22',
            'description' => 'My Tx Updated',
            'amount' => 600,
            'type' => 'expense',
            'wallet_id' => $wallet->id,
            'user_id' => $user->id,
        ]);
        $response->assertStatus(302);
        $this->assertEquals('My Tx Updated', $transaction->fresh()->description);

        // 2. Delete own transaction
        $response = $this->actingAs($user)->delete("/transactions/{$transaction->id}");
        $response->assertStatus(302);
        $this->assertSoftDeleted('transactions', ['id' => $transaction->id]);
    }
}
