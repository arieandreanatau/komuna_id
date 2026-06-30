<?php

declare(strict_types=1);

namespace App\Http\Requests\Community;

use Illuminate\Foundation\Http\FormRequest;

class AssignCommunityRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'role_slug' => 'required|string|in:community-admin,event-manager,volunteer-coordinator',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
