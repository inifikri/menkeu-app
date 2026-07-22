# Authentication Enhancement Layer Documentation

## 1. Architecture Overview

The Authentication Enhancement Layer is implemented as an additive, modular layer on top of the existing Laravel Breeze & InertiaJS authentication system. It introduces two primary sub-systems:
- **Trusted Device Recognition**: Identifies and logs browsers/devices using secure, signed, and encrypted cookies without modifying the core Laravel Session or Guard logic.
- **PIN Access Protection**: A numeric 6-digit PIN system that provides secure, password-less login on recognized trusted devices.

### Class Layout & SOLID Structure
- **Models**:
  - `TrustedDevice`: Models the database records for registered client machines/browsers.
  - `UserPin`: Stores the hashed 6-digit PIN code.
  - `SecurityLog`: Stores security-sensitive events for audit trails.
- **Repositories**:
  - `TrustedDeviceRepository`: Isolates all database operations for `trusted_devices`.
  - `PinRepository`: Isolates database operations for `user_pins`.
- **Services**:
  - `DeviceService`: Parses platform/browser details from User-Agents and sets up HTTP-Only, Secure, SameSite Strict cookies.
  - `PinService`: Handles hashing (using bcrypt/argon2 via Laravel Hash) and PIN validation.
  - `TrustedDeviceService`: Implements trusted device verification, lockout management, and list operations.
  - `SecurityLogService`: Handles logging of security events to the audit database.
- **Middlewares**:
  - `TrustedDeviceMiddleware`: Restricts authenticated users from reaching the application without registering their current device.
  - `PinAuthenticationMiddleware`: Automatically detects cookie expiration, cookie deletion, or remote device removals and forces a fallback to Email & Password login.

---

## 2. ERD (Entity Relationship Diagram)

```
  +------------------+          +------------------------+
  |      users       | <------+ |    trusted_devices     |
  +------------------+          +------------------------+
  | id (PK)          |          | id (PK)                |
  | name             |          | user_id (FK)           |
  | email            |          | device_uuid            |
  | password         |          | device_name            |
  | role             |          | browser                |
  | avatarColor      |          | platform               |
  | permissions      |          | ip_address             |
  +------------------+          | user_agent             |
           |                    | remember_token         |
           | (1 : 1)            | remember_until         |
           v                    | trusted_at             |
  +------------------+          | last_login             |
  |    user_pins     |          | failed_attempt         |
  +------------------+          | locked_until           |
  | id (PK)          |          +------------------------+
  | user_id (FK)     |
  | pin_hash         |          +------------------------+
  +------------------+          |     security_logs      |
                                +------------------------+
                                | id (PK)                |
                                | user_id (FK, Nullable) |
                                | action                 |
                                | ip_address             |
                                | browser                |
                                | user_agent             |
                                +------------------------+
```

---

## 3. Sequence Diagrams

### Flow A: First Login (Device Registration & PIN Creation)

```
User (Browser)           Laravel Login Route         TrustedDeviceMiddleware      DeviceRegister Screen       Dashboard
     |                             |                            |                            |                    |
     |---- 1. Submit Credentials ->|                            |                            |                    |
     |     (Email & Password)      |                            |                            |                    |
     |                             |--- 2. Authenticate user    |                            |                    |
     |                             |       & set session flag   |                            |                    |
     |                             |       "password_auth" -----|                            |                    |
     |<--- 3. Redirect to / -------|                            |                            |                    |
     |                                                          |                            |                    |
     |---- 4. Request / --------------------------------------->|                            |                    |
     |                                                          |--- 5. Checks device cookie |                            |
     |                                                          |       (Unrecognized)       |                            |
     |                                                          |                            |                            |
     |                                                          |--- 6. Sees session flag    |                            |
     |                                                          |       "password_auth=true" |                            |
     |                                                          |       redirects to         |                            |
     |                                                          |       /device-register --->|                            |
     |<--- 7. Render Registration Form -------------------------|----------------------------|                            |
     |                                                                                       |                            |
     |---- 8. Input Device Name & PIN ------------------------------------------------------>|                            |
     |                                                                                       |--- 9. Hash PIN & save,     |
     |                                                                                       |       Register Device,     |
     |                                                                                       |       Queue cookies,       |
     |                                                                                       |       Trigger Events       |
     |<--- 10. Redirect to / (Dashboard) ----------------------------------------------------|--------------------------->|
```

### Flow B: Next Login (PIN Login on Trusted Device)

```
User (Browser)               Laravel Login /                  Controller (pinLogin)                Dashboard
     |                             |                                    |                              |
     |---- 1. Request / (Guest) -->|                                    |                              |
     |                             |--- 2. Detects trusted device cookie|                              |
     |                             |       and matches database record -|                              |
     |<--- 3. Render PIN Screen ---|                                    |                              |
     |                                                                  |                              |
     |---- 4. Input 6-Digit PIN --------------------------------------->|                              |
     |                                                                  |--- 5. Verify PIN Hash        |
     |                                                                  |       in Database            |
     |                                                                  |                              |
     |                                                                  |--- 6. Log user in &          |
     |                                                                  |       regenerate session     |
     |<--- 7. Redirect to Dashboard ------------------------------------|----------------------------->|
```

---

## 4. Security Design & Threat Analysis

| Threat / Risk | Mitigations Implemented |
| :--- | :--- |
| **PIN Guessing / Brute-Force** | - Built-in lockout after **5 failed attempts** per device.<br>- Lockout duration is **15 minutes** (configurable).<br>- Rate limiting at route level via middleware throttling. |
| **Reverse Engineering Cookie Values** | - Cookies (`device_uuid`, `device_token`) are fully **encrypted and signed** by Laravel's key.<br>- `user_id` is never stored in cookies.<br>- Cookie attributes: `HttpOnly`, `Secure`, `SameSite Strict`. |
| **Session Hijacking / CSRF** | - CSRF validation is enforced on all API endpoints (`/pin/login`, etc.).<br>- Session regeneration is executed immediately upon PIN verification. |
| **Unauthorized PIN Reset** | - Resetting a PIN **requires full password verification**.<br>- Prevents resetting the PIN using only the PIN itself. |
| **Physical Access (Unattended Device)** | - Remote device management allows users to instantly revoke trust for any device from another session, immediately invalidating its cookies and logging it out. |

---

## 5. Testing Guide

Run all tests via PHPUnit to verify functionality:

```bash
php artisan test --filter=AuthenticationEnhancementTest
```

### Scenarios Covered
1. **First Login Redirect**: Verifies unrecognised devices are intercepted and redirected to register.
2. **Device Registration & PIN Creation**: Tests form submission, secure cookies, and events.
3. **PIN Authentication**: Validates that users can log in via PIN when the device is recognized.
4. **Failed PIN Attempt Count**: Tests that incorrect PIN increases attempts.
5. **Lockout Mechanism**: Verifies that 5 failures locks the device and rejects logins.
6. **Bypass Lockout with Password**: Confirms users can still use password login during PIN lockout.
7. **PIN Resetting**: Tests password confirmation and PIN updating.
8. **Removed Devices**: Tests that removing a device immediately invalidates sessions.
9. **Multi-device remote revocation**: Confirms revoking other devices works cleanly.

---

## 6. Deployment Guide

1. **Pull changes** to the host.
2. **Add configuration** to `.env`:
   ```ini
   TRUSTED_DEVICE_EXPIRED=30
   ```
3. **Run database migrations**:
   ```bash
   php artisan migrate --force
   ```
4. **Build assets**:
   ```bash
   npm run build
   ```
5. **Clear application cache**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   ```

---

## 7. Rollback Guide

If any issues arise, follow these steps to revert:

1. **Restore codebase**:
   ```bash
   git revert [commit-hash] # Revert authentication enhancement commit
   ```
2. **Rollback migrations**:
   ```bash
   php artisan migrate:rollback --step=3
   ```
3. **Clear cookies client-side**:
   Cookies `device_uuid` and `device_token` will automatically be cleared upon next visits or can be cleared via browser settings.
4. **Re-cache configurations**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   ```
