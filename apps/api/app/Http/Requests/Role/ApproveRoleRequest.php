<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class ApproveRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'notes' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'notes.string' => 'Catatan harus berupa teks.',
        ];
    }
}
