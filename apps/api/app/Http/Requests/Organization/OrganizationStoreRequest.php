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
            'type' => 'nullable|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'address' => 'nullable|string|max:1000',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'social_media' => 'nullable|array',
            'applicant_position' => 'nullable|string|max:255',
            'purpose' => 'nullable|string|max:5000',
            'logo' => 'nullable|image|max:1024',
        ];
    }
}
