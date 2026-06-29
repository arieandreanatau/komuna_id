<?php

declare(strict_types=1);

namespace App\Http\Requests\Community;

use Illuminate\Foundation\Http\FormRequest;

class CommunityUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:5000',
            'category_id' => 'sometimes|exists:community_categories,id',
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'join_mode' => 'in:open,approval_required,invite_only',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 5000 karakter.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'website.url' => 'Format URL tidak valid.',
            'join_mode.in' => 'Mode join tidak valid.',
        ];
    }
}
