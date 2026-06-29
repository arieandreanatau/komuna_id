<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EventStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Event $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'description',
        'cover_image',
        'community_id',
        'organizer_id',
        'status',
        'start_date',
        'end_date',
        'location',
        'location_url',
        'is_online',
        'online_url',
        'max_participants',
        'current_participants',
        'ticket_price',
        'currency',
    ];

    protected function casts(): array
    {
        return [
            'status' => EventStatus::class,
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'is_online' => 'boolean',
            'max_participants' => 'integer',
            'current_participants' => 'integer',
            'ticket_price' => 'decimal:2',
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

    public function tickets(): HasMany
    {
        return $this->hasMany(EventTicket::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
}
