<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ApprovalStatus;
use Database\Factories\BrandFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Brand extends Model
{
    use HasFactory, SoftDeletes;

    protected static function newFactory(): BrandFactory
    {
        return BrandFactory::new();
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Brand $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'category',
        'description',
        'logo',
        'banner',
        'website',
        'email',
        'phone',
        'social_media',
        'main_products',
        'target_audience',
        'campaign_area',
        'purpose',
        'ownership_proof',
        'owner_id',
        'organization_id',
        'status',
        'rejection_reason',
        'verification_status',
        'verification_notes',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ApprovalStatus::class,
            'verified_at' => 'datetime',
            'social_media' => 'array',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(BrandMember::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(BrandDocument::class);
    }

    public function roleHistories(): HasMany
    {
        return $this->hasMany(BrandRoleHistory::class);
    }

    public function setting(): HasOne
    {
        return $this->hasOne(BrandSetting::class);
    }

    public function verificationHistories(): HasMany
    {
        return $this->hasMany(BrandVerificationHistory::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    public function isOwner(int $userId): bool
    {
        return $this->owner_id === $userId;
    }

    public function hasMemberRole(int $userId, string ...$roles): bool
    {
        return $this->members()
            ->where('user_id', $userId)
            ->whereIn('role', $roles)
            ->where('status', 'active')
            ->exists();
    }

    public function getMemberRole(int $userId): ?string
    {
        $member = $this->members()
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->first();

        return $member?->role;
    }

    public function isIndependent(): bool
    {
        return is_null($this->organization_id);
    }
}
