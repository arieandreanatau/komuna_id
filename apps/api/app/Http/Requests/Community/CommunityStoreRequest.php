<?php

declare(strict_types=1);

namespace App\Http\Requests\Community;

use Illuminate\Foundation\Http\FormRequest;

class CommunityStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category_id' => 'required|exists:community_categories,id',
            'reason' => 'required|string|max:2000',
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'join_mode' => 'in:open,approval_required,invite_only',
            'cover_image' => 'nullable|image|max:2048',
            'logo' => 'nullable|image|max:1024',
            'instagram' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama komunitas wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'description.required' => 'Deskripsi wajib diisi.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 5000 karakter.',
            'category_id.required' => 'Kategori wajib diisi.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'reason.required' => 'Alasan membuat komunitas wajib diisi.',
            'reason.max' => 'Alasan maksimal 2000 karakter.',
            'website.url' => 'Format URL tidak valid.',
            'join_mode.in' => 'Mode join tidak valid.',
            'cover_image.image' => 'Cover image harus berupa gambar.',
            'cover_image.max' => 'Cover image maksimal 2048KB.',
            'logo.image' => 'Logo harus berupa gambar.',
            'logo.max' => 'Logo maksimal 1024KB.',
            'email.email' => 'Format email tidak valid.',
            'phone.string' => 'Telepon harus berupa teks.',
            'phone.max' => 'Telepon maksimal 20 karakter.',
        ];
    }
}
