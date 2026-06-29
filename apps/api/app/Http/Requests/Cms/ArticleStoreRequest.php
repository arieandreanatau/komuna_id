<?php

declare(strict_types=1);

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class ArticleStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:1000',
            'category_id' => 'nullable|exists:article_categories,id',
            'cover_image' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul wajib diisi.',
            'title.string' => 'Judul harus berupa teks.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'content.required' => 'Konten wajib diisi.',
            'content.string' => 'Konten harus berupa teks.',
            'excerpt.string' => 'Ringkasan harus berupa teks.',
            'excerpt.max' => 'Ringkasan maksimal 1000 karakter.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'cover_image.image' => 'Cover image harus berupa gambar.',
            'cover_image.max' => 'Cover image maksimal 2048KB.',
        ];
    }
}
