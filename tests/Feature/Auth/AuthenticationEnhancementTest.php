<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\TrustedDevice;
use App\Models\UserPin;
use App\Models\SecurityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Cookie;
use Carbon\Carbon;
use Tests\TestCase;

class AuthenticationEnhancementTest extends TestCase
{
    use RefreshDatabase;

    protected $defaultHeaders = [
        'X-Test-Authentication-Enhancement' => 'true',
    ];




    public function test_authenticated_user_without_trusted_device_is_redirected_to_device_register(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withSession(['password_authenticated' => true])
            ->get('/');

        $response->assertRedirect(route('device.register'));
    }

    public function test_user_can_register_device_and_create_pin(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/device-register', [
            'device_name' => 'Test Laptop',
            'pin' => '123456',
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('trusted_devices', [
            'user_id' => $user->id,
            'device_name' => 'Test Laptop',
        ]);

        $this->assertDatabaseHas('user_pins', [
            'user_id' => $user->id,
        ]);

        $pinRecord = UserPin::where('user_id', $user->id)->first();
        $this->assertTrue(Hash::check('123456', $pinRecord->pin_hash));

        // Verify cookies are set
        $response->assertCookie('device_uuid');
        $response->assertCookie('device_token');

        $device = TrustedDevice::where('user_id', $user->id)->first();
        $this->assertNotNull($device);
        
        $this->assertDatabaseHas('security_logs', [
            'user_id' => $user->id,
            'action' => 'New Device',
        ]);
        
        $this->assertDatabaseHas('security_logs', [
            'user_id' => $user->id,
            'action' => 'Reset PIN',
        ]);
    }

    public function test_user_can_authenticate_using_pin(): void
    {
        $user = User::factory()->create();
        UserPin::create([
            'user_id' => $user->id,
            'pin_hash' => Hash::make('123456'),
        ]);

        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
            'trusted_at' => Carbon::now(),
        ]);

        // Mock cookies for the PIN login request
        $response = $this->withCookies([
            'device_uuid' => 'test-uuid-123',
            'device_token' => 'test-token-456',
        ])->post('/pin/login', [
            'pin' => '123456',
        ]);


        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('security_logs', [
            'user_id' => $user->id,
            'action' => 'Login PIN',
        ]);
    }

    public function test_invalid_pin_increments_failed_attempts(): void
    {
        $user = User::factory()->create();
        UserPin::create([
            'user_id' => $user->id,
            'pin_hash' => Hash::make('123456'),
        ]);

        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
            'trusted_at' => Carbon::now(),
            'failed_attempt' => 0,
        ]);

        $response = $this->withCookies([
            'device_uuid' => 'test-uuid-123',
            'device_token' => 'test-token-456',
        ])->post('/pin/login', [
            'pin' => '000000', // wrong pin
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('pin');
        
        $device->refresh();
        $this->assertEquals(1, $device->failed_attempt);

        $this->assertDatabaseHas('security_logs', [
            'user_id' => $user->id,
            'action' => 'Failed PIN',
        ]);
    }

    public function test_device_is_locked_after_max_failed_attempts(): void
    {
        $user = User::factory()->create();
        UserPin::create([
            'user_id' => $user->id,
            'pin_hash' => Hash::make('123456'),
        ]);

        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
            'trusted_at' => Carbon::now(),
            'failed_attempt' => 4, // 5th failed attempt will lock
        ]);

        $response = $this->withCookies([
            'device_uuid' => 'test-uuid-123',
            'device_token' => 'test-token-456',
        ])->post('/pin/login', [
            'pin' => '000000', // wrong pin
        ]);

        $this->assertGuest();
        
        $device->refresh();
        $this->assertEquals(5, $device->failed_attempt);
        $this->assertNotNull($device->locked_until);
        $this->assertTrue(Carbon::now()->lessThan($device->locked_until));

        // Submitting correct PIN during lockout should fail
        $response2 = $this->withCookies([
            'device_uuid' => 'test-uuid-123',
            'device_token' => 'test-token-456',
        ])->post('/pin/login', [
            'pin' => '123456', // correct pin
        ]);

        $response2->assertRedirect(route('login'));
        $response2->assertSessionHasErrors('pin');
        $this->assertGuest();
    }

    public function test_lockout_does_not_prevent_password_login(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);

        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
            'trusted_at' => Carbon::now(),
            'failed_attempt' => 5,
            'locked_until' => Carbon::now()->addMinutes(15),
        ]);

        // Email and password login should still work
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_can_reset_pin_using_password_confirmation(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);
        UserPin::create([
            'user_id' => $user->id,
            'pin_hash' => Hash::make('123456'),
        ]);

        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
            'trusted_at' => Carbon::now(),
        ]);

        $response = $this->actingAs($user)
            ->withCookies([
                'device_uuid' => 'test-uuid-123',
                'device_token' => 'test-token-456',
            ])
            ->post('/pin/reset', [
                'password' => 'password123',
                'pin' => '654321',
            ]);

        $response->assertSessionHasNoErrors();
        
        $pinRecord = UserPin::where('user_id', $user->id)->first();
        $this->assertTrue(Hash::check('654321', $pinRecord->pin_hash));

        $this->assertDatabaseHas('security_logs', [
            'user_id' => $user->id,
            'action' => 'Reset PIN',
        ]);
    }

    public function test_pin_reset_requires_correct_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);
        UserPin::create([
            'user_id' => $user->id,
            'pin_hash' => Hash::make('123456'),
        ]);

        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
            'trusted_at' => Carbon::now(),
        ]);

        $response = $this->actingAs($user)
            ->withCookies([
                'device_uuid' => 'test-uuid-123',
                'device_token' => 'test-token-456',
            ])
            ->post('/pin/reset', [
                'password' => 'wrong-password',
                'pin' => '654321',
            ]);

        $response->assertSessionHasErrors('password');
        
        $pinRecord = UserPin::where('user_id', $user->id)->first();
        $this->assertTrue(Hash::check('123456', $pinRecord->pin_hash));
    }

    public function test_expired_device_cookie_forces_password_login(): void
    {
        $user = User::factory()->create();
        UserPin::create([
            'user_id' => $user->id,
            'pin_hash' => Hash::make('123456'),
        ]);

        // Device is expired
        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->subDays(1), // expired yesterday
            'trusted_at' => Carbon::now()->subDays(31),
        ]);

        // Acting as user with expired device cookie
        $response = $this->actingAs($user)
            ->withCookies([
                'device_uuid' => 'test-uuid-123',
                'device_token' => 'test-token-456',
            ])
            ->get('/');

        // Middleware should log out user and redirect to login
        $this->assertGuest();
        $response->assertRedirect(route('login'));
    }

    public function test_removed_device_forces_logout(): void
    {
        $user = User::factory()->create();
        UserPin::create([
            'user_id' => $user->id,
            'pin_hash' => Hash::make('123456'),
        ]);

        // Device is NOT in the database (e.g. removed), but cookie is present
        $response = $this->actingAs($user)
            ->withCookies([
                'device_uuid' => 'non-existent-uuid',
                'device_token' => 'some-token',
            ])
            ->get('/');

        $this->assertGuest();
        $response->assertRedirect(route('login'));
    }

    public function test_user_can_rename_device(): void
    {
        $user = User::factory()->create();
        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Old Name',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
        ]);

        $response = $this->actingAs($user)
            ->withCookies([
                'device_uuid' => 'test-uuid-123',
                'device_token' => 'test-token-456',
            ])
            ->put("/trusted-devices/{$device->id}", [
                'device_name' => 'New Name',
            ]);

        $response->assertSessionHasNoErrors();
        $device->refresh();
        $this->assertEquals('New Name', $device->device_name);
    }

    public function test_user_can_remove_device(): void
    {
        $user = User::factory()->create();
        $device = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'test-uuid-123',
            'device_name' => 'Test Laptop',
            'remember_token' => 'test-token-456',
            'remember_until' => Carbon::now()->addDays(30),
        ]);

        $response = $this->actingAs($user)
            ->withCookies([
                'device_uuid' => 'test-uuid-123',
                'device_token' => 'test-token-456',
            ])
            ->delete("/trusted-devices/{$device->id}");

        // Removing current device will also log out user
        $this->assertGuest();
        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('trusted_devices', ['id' => $device->id]);

        $this->assertDatabaseHas('security_logs', [
            'user_id' => $user->id,
            'action' => 'Device Removed',
        ]);
    }

    public function test_user_can_remove_all_other_devices(): void
    {
        $user = User::factory()->create();
        
        $currentDevice = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'current-uuid',
            'device_name' => 'Current Laptop',
            'remember_token' => 'current-token',
            'remember_until' => Carbon::now()->addDays(30),
        ]);

        $otherDevice = TrustedDevice::create([
            'user_id' => $user->id,
            'device_uuid' => 'other-uuid',
            'device_name' => 'Other Laptop',
            'remember_token' => 'other-token',
            'remember_until' => Carbon::now()->addDays(30),
        ]);

        $response = $this->actingAs($user)
            ->withCookies([
                'device_uuid' => 'current-uuid',
                'device_token' => 'current-token',
            ])
            ->delete("/trusted-devices");

        $response->assertSessionHasNoErrors();
        
        // Current device should still exist, other device should be deleted
        $this->assertDatabaseHas('trusted_devices', ['id' => $currentDevice->id]);
        $this->assertDatabaseMissing('trusted_devices', ['id' => $otherDevice->id]);
        
        // Still authenticated since current device was not removed
        $this->assertAuthenticatedAs($user);
    }
}
