<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Role;
use App\Models\User;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'status' => UserStatus::ACTIVE,
            'email_verified_at' => now(),
        ]);

        $user->profile()->create([]);

        $memberRole = Role::where('slug', 'member')->first();
        if ($memberRole) {
            $user->roles()->create([
                'role_id' => $memberRole->id,
                'is_active' => true,
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status->value,
            ],
            'token' => $token,
        ], 'Registrasi berhasil', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        if ($user->status === UserStatus::SUSPENDED) {
            return $this->errorResponse('Akun Anda telah ditangguhkan', 403);
        }

        if ($user->status === UserStatus::BANNED) {
            return $this->errorResponse('Akun Anda telah diblokir', 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status->value,
            ],
            'token' => $token,
        ], 'Login berhasil');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logout berhasil');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load(['profile', 'roles.role']);

        return $this->successResponse([
            'id' => $user->id,
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status->value,
            'email_verified_at' => $user->email_verified_at,
            'profile' => $user->profile,
            'roles' => $user->roles->map(fn ($ur) => [
                'id' => $ur->role->id,
                'name' => $ur->role->name,
                'slug' => $ur->role->slug,
                'scope' => $ur->role->scope,
                'scope_type' => $ur->scope_type,
                'scope_id' => $ur->scope_id,
            ]),
            'created_at' => $user->created_at,
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'sometimes|nullable|string|max:1000',
            'phone' => 'sometimes|nullable|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'website' => 'sometimes|nullable|url|max:255',
        ]);

        $user = $request->user();

        if (isset($validated['name'])) {
            $user->update(['name' => $validated['name']]);
            unset($validated['name']);
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return $this->successResponse(null, 'Profil berhasil diperbarui');
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return $this->errorResponse('Password lama salah', 422);
        }

        $user->update(['password' => $validated['password']]);

        return $this->successResponse(null, 'Password berhasil diubah');
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? $this->successResponse(null, 'Link reset password telah dikirim')
            : $this->errorResponse('Gagal mengirim link reset password', 500);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => $password,
                ])->setRememberToken(Str::random(60));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? $this->successResponse(null, 'Password berhasil direset')
            : $this->errorResponse('Gagal mereset password', 500);
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->successResponse(null, 'Email sudah terverifikasi');
        }

        $request->user()->markEmailAsVerified();

        return $this->successResponse(null, 'Email berhasil diverifikasi');
    }

    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->errorResponse('Email sudah terverifikasi', 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->successResponse(null, 'Email verifikasi telah dikirim ulang');
    }
}
