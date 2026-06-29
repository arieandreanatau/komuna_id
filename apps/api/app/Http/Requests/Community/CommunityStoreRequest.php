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
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'join_mode' => 'in:open,approval_required,invite_only',
            'cover_image' => 'nullable|image|max:2048',
            'logo' => 'nullable|image|max:1024',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'description.required' => 'Deskripsi wajib diisi.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 5000 karakter.',
            'category_id.required' => 'Kategori wajib diisi.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'website.url' => 'Format URL tidak valid.',
            'join_mode.in' => 'Mode join tidak valid.',
            'cover_image.image' => 'Cover image harus berupa gambar.',
            'cover_image.max' => 'Cover image maksimal 2048KB.',
            'logo.image' => 'Logo harus berupa gambar.',
            'logo.max' => 'Logo maksimal 1024KB.',
        ];
    }
}
