<?php

declare(strict_types=1);

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class EventUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:10000',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'location_url' => 'nullable|url|max:255',
            'is_online' => 'boolean',
            'online_url' => 'nullable|url|max:255',
            'max_participants' => 'nullable|integer|min:1',
            'ticket_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
        ];
    }

    public function messages(): array
    {
        return [
            'title.string' => 'Judul harus berupa teks.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 10000 karakter.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'end_date.date' => 'Format tanggal selesai tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
            'location_url.url' => 'Format URL lokasi tidak valid.',
            'online_url.url' => 'Format URL online tidak valid.',
            'max_participants.integer' => 'Maksimal peserta harus berupa angka.',
            'max_participants.min' => 'Maksimal peserta minimal 1.',
            'ticket_price.numeric' => 'Harga tiket harus berupa angka.',
            'ticket_price.min' => 'Harga tiket minimal 0.',
            'currency.max' => 'Mata uang maksimal 3 karakter.',
        ];
    }
}
