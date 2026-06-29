<?php

declare(strict_types=1);

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class ArticleUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'nullable|string|max:1000',
            'category_id' => 'nullable|exists:article_categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.string' => 'Judul harus berupa teks.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'content.string' => 'Konten harus berupa teks.',
            'excerpt.string' => 'Ringkasan harus berupa teks.',
            'excerpt.max' => 'Ringkasan maksimal 1000 karakter.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
        ];
    }
}
