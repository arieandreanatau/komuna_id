<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerApplication extends Model
{
    protected $fillable = [
        'opportunity_id', 'user_id', 'status', 'message', 'admin_notes', 'reviewed_at',
    ];

    protected function casts(): array
    {
        return ['reviewed_at' => 'datetime'];
    }

    public function opportunity(): BelongsTo { return $this->belongsTo(VolunteerOpportunity::class, 'opportunity_id'); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
