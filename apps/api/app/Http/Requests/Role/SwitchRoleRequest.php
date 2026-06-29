<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class SwitchRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_role_id' => 'required|exists:user_roles,id',
        ];
    }

    public function messages(): array
    {
        return [
            'user_role_id.required' => 'User role wajib diisi.',
            'user_role_id.exists' => 'User role tidak ditemukan.',
        ];
    }
}
