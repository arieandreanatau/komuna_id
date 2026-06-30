<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandSetting extends Model
{
    protected $fillable = [
        'brand_id',
        'is_public',
        'allow_collaboration_inquiries',
        'notification_preferences',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'allow_collaboration_inquiries' => 'boolean',
            'notification_preferences' => 'array',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}
