<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunitySetting extends Model
{
    protected $fillable = [
        'community_id',
        'key',
        'value',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }
}
