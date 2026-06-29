<?php

declare(strict_types=1);

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class EventStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:10000',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'location_url' => 'nullable|url|max:255',
            'is_online' => 'boolean',
            'online_url' => 'nullable|url|max:255',
            'max_participants' => 'nullable|integer|min:1',
            'ticket_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'cover_image' => 'nullable|image|max:2048',
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
            'description.max' => 'Deskripsi maksimal 10000 karakter.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'start_date.after' => 'Tanggal mulai harus setelah saat ini.',
            'end_date.required' => 'Tanggal selesai wajib diisi.',
            'end_date.date' => 'Format tanggal selesai tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
            'location_url.url' => 'Format URL lokasi tidak valid.',
            'online_url.url' => 'Format URL online tidak valid.',
            'max_participants.integer' => 'Maksimal peserta harus berupa angka.',
            'max_participants.min' => 'Maksimal peserta minimal 1.',
            'ticket_price.numeric' => 'Harga tiket harus berupa angka.',
            'ticket_price.min' => 'Harga tiket minimal 0.',
            'currency.max' => 'Mata uang maksimal 3 karakter.',
            'cover_image.image' => 'Cover image harus berupa gambar.',
            'cover_image.max' => 'Cover image maksimal 2048KB.',
        ];
    }
}
