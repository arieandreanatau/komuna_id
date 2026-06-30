<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'sometimes|string|min:3|max:30|alpha_dash|unique:users,username,'.$this->user()?->id,
            'full_name' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|nullable|email|max:255|unique:users,email,'.$this->user()?->id,
            'phone_number' => 'sometimes|nullable|string|max:20',
            'bio' => 'sometimes|nullable|string|max:1000',
            'phone' => 'sometimes|nullable|string|max:20',
            'location' => 'sometimes|nullable|string|max:255',
            'website' => 'sometimes|nullable|url|max:255',
            'avatar' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'username.min' => 'Username minimal 3 karakter.',
            'username.max' => 'Username maksimal 30 karakter.',
            'username.alpha_dash' => 'Username hanya boleh berisi huruf, angka, dash, dan underscore.',
            'username.unique' => 'Username sudah digunakan.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'full_name.string' => 'Nama harus berupa teks.',
            'full_name.max' => 'Nama maksimal 255 karakter.',
            'bio.string' => 'Bio harus berupa teks.',
            'bio.max' => 'Bio maksimal 1000 karakter.',
            'phone.string' => 'Telepon harus berupa teks.',
            'phone.max' => 'Telepon maksimal 20 karakter.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'website.url' => 'Format URL tidak valid.',
            'website.max' => 'Website maksimal 255 karakter.',
        ];
    }
}
