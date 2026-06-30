<?php

declare(strict_types=1);

namespace App\Http\Requests\Community;

use Illuminate\Foundation\Http\FormRequest;

class EventCheckinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'qr_code' => 'required_without:user_id|string',
            'user_id' => 'required_without:qr_code|integer|exists:users,id',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
