<?php

declare(strict_types=1);

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'location' => 'nullable|string|max:255',
            'pic_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'instagram' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:1024',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama organization wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'type.required' => 'Jenis organization wajib diisi.',
            'type.string' => 'Jenis harus berupa teks.',
            'type.max' => 'Jenis maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 5000 karakter.',
            'pic_name.required' => 'Nama PIC / penanggung jawab wajib diisi.',
            'pic_name.string' => 'Nama PIC harus berupa teks.',
            'pic_name.max' => 'Nama PIC maksimal 255 karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'phone.string' => 'Telepon harus berupa teks.',
            'phone.max' => 'Telepon maksimal 20 karakter.',
            'website.url' => 'Format URL tidak valid.',
            'logo.image' => 'Logo harus berupa gambar.',
            'logo.max' => 'Logo maksimal 1024KB.',
        ];
    }
}
