<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VolunteerOpportunity extends Model
{
    protected $fillable = [
        'community_id', 'organizer_id', 'title', 'description',
        'location', 'is_online', 'start_date', 'end_date',
        'max_volunteers', 'current_volunteers', 'status', 'skills_required',
    ];

    protected function casts(): array
    {
        return [
            'is_online' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(VolunteerApplication::class, 'opportunity_id');
    }
}
