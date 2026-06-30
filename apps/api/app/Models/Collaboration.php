<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CollaborationStatus;
use Database\Factories\CollaborationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Collaboration extends Model
{
    use HasFactory, SoftDeletes;

    protected static function newFactory(): CollaborationFactory
    {
        return CollaborationFactory::new();
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Collaboration $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'uuid',
        'title',
        'description',
        'sender_type',
        'sender_id',
        'receiver_type',
        'receiver_id',
        'status',
        'budget',
        'start_date',
        'end_date',
    ];

    protected function casts(): array
    {
        return [
            'status' => CollaborationStatus::class,
            'budget' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function deliverables(): HasMany
    {
        return $this->hasMany(CollaborationDeliverable::class);
    }

    public function sender()
    {
        return $this->morphTo();
    }

    public function receiver()
    {
        return $this->morphTo();
    }
}
