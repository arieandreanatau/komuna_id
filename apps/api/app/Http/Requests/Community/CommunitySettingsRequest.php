<?php

declare(strict_types=1);

namespace App\Http\Requests\Community;

use Illuminate\Foundation\Http\FormRequest;

class CommunitySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_public' => 'boolean',
            'join_mode' => 'sometimes|string|in:open,approval_required,invite_only',
            'allow_member_post' => 'boolean',
            'require_event_approval' => 'boolean',
            'settings' => 'nullable|array',
        ];
    }
}
