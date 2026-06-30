<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationSetting extends Model
{
    protected $fillable = [
        'organization_id',
        'is_public',
        'allow_collaboration_inquiries',
        'show_members_publicly',
        'notification_preferences',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'allow_collaboration_inquiries' => 'boolean',
            'show_members_publicly' => 'boolean',
            'notification_preferences' => 'array',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
