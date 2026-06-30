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
use App\Http\Requests\Auth\ProfileUpdateRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Services\EmailNotificationService;
use App\Services\FileUploadService;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email ?? null,
            'password' => $request->password,
            'full_name' => $request->full_name ?? null,
            'phone_number' => $request->phone_number ?? null,
            'status' => UserStatus::ACTIVE,
            'verification_level' => 1,
        ]);

        $user->profile()->create([
            'full_name' => $request->full_name ?? null,
            'phone' => $request->phone_number ?? null,
            'location' => $request->location ?? null,
        ]);

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
                'username' => $user->username,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'status' => $user->status->value,
                'verification_level' => $user->verification_level,
            ],
            'token' => $token,
        ], 'Registrasi berhasil', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $login = $request->input('login');

        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'login' => ['Akun tidak ditemukan.'],
            ]);
        }

        if (! Hash::check($request->input('password'), $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Password salah.'],
            ]);
        }

        if ($user->status === UserStatus::SUSPENDED) {
            return $this->errorResponse('Akun sedang dinonaktifkan. Hubungi admin.', 403);
        }

        if ($user->status === UserStatus::BANNED) {
            return $this->errorResponse('Akun telah diblokir. Hubungi admin.', 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        $user->load(['profile', 'roles.role']);

        return $this->successResponse([
            'user' => new \App\Http\Resources\UserResource($user),
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

        return $this->successResponse(new \App\Http\Resources\UserResource($user));
    }

    public function updateProfile(ProfileUpdateRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();

        if (isset($validated['full_name'])) {
            $user->update(['full_name' => $validated['full_name']]);
            unset($validated['full_name']);
        }

        if (isset($validated['username'])) {
            $user->update(['username' => $validated['username']]);
            unset($validated['username']);
        }

        if (isset($validated['phone_number'])) {
            $user->update(['phone_number' => $validated['phone_number']]);
            unset($validated['phone_number']);
        }

        if (isset($validated['email'])) {
            $user->update(['email' => $validated['email']]);
            unset($validated['email']);
        }

        if ($request->hasFile('avatar')) {
            $existingAvatar = $user->profile?->avatar;
            if ($existingAvatar) {
                FileUploadService::delete($existingAvatar);
            }
            $validated['avatar'] = FileUploadService::uploadPublic($request->file('avatar'), 'avatars');
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return $this->successResponse(null, 'Profil berhasil diperbarui');
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

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
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->successResponse(null, 'Email sudah terverifikasi');
        }

        $user->markEmailAsVerified();

        if ($user->verification_level < 2) {
            $user->update(['verification_level' => 2]);
        }

        return $this->successResponse(null, 'Email berhasil diverifikasi');
    }

    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->errorResponse('Email sudah terverifikasi', 400);
        }

        if (empty($request->user()->email)) {
            return $this->errorResponse('Akun belum memiliki email. Tambahkan email terlebih dahulu.', 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->successResponse(null, 'Email verifikasi telah dikirim ulang');
    }
}
