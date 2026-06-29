<?php

declare(strict_types=1);

namespace App\Http\Requests\Brand;

use Illuminate\Foundation\Http\FormRequest;

class BrandStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'website' => 'nullable|url|max:255',
            'email' => 'required|email|max:255',
            'organization_id' => 'nullable|exists:organizations,id',
            'logo' => 'nullable|image|max:1024',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 5000 karakter.',
            'website.url' => 'Format URL tidak valid.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'organization_id.exists' => 'Organisasi tidak ditemukan.',
            'logo.image' => 'Logo harus berupa gambar.',
            'logo.max' => 'Logo maksimal 1024KB.',
        ];
    }
}
