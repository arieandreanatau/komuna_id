<?php

declare(strict_types=1);

namespace App\Http\Requests\Collaboration;

use Illuminate\Foundation\Http\FormRequest;

class CollaborationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'sender_type' => 'required|in:brand,organization',
            'sender_id' => 'required|integer',
            'receiver_type' => 'required|in:community',
            'receiver_id' => 'required|integer',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul wajib diisi.',
            'title.string' => 'Judul harus berupa teks.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'description.required' => 'Deskripsi wajib diisi.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 5000 karakter.',
            'sender_type.required' => 'Tipe pengirim wajib diisi.',
            'sender_type.in' => 'Tipe pengirim tidak valid.',
            'sender_id.required' => 'ID pengirim wajib diisi.',
            'sender_id.integer' => 'ID pengirim harus berupa angka.',
            'receiver_type.required' => 'Tipe penerima wajib diisi.',
            'receiver_type.in' => 'Tipe penerima tidak valid.',
            'receiver_id.required' => 'ID penerima wajib diisi.',
            'receiver_id.integer' => 'ID penerima harus berupa angka.',
            'budget.numeric' => 'Budget harus berupa angka.',
            'budget.min' => 'Budget minimal 0.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'end_date.date' => 'Format tanggal selesai tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
        ];
    }
}
