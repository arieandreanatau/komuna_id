<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvitationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'role_id' => 'required|exists:roles,id',
            'invitable_type' => 'required|string',
            'invitable_id' => 'required|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'role_id.required' => 'Role wajib diisi.',
            'role_id.exists' => 'Role tidak ditemukan.',
            'invitable_type.required' => 'Tipe entitas wajib diisi.',
            'invitable_type.string' => 'Tipe entitas harus berupa teks.',
            'invitable_id.required' => 'ID entitas wajib diisi.',
            'invitable_id.integer' => 'ID entitas harus berupa angka.',
        ];
    }
}
