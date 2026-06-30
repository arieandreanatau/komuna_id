<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ApprovalStatus;
use Database\Factories\OrganizationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected static function newFactory(): OrganizationFactory
    {
        return OrganizationFactory::new();
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Organization $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'type',
        'legal_name',
        'description',
        'logo',
        'website',
        'email',
        'phone',
        'address',
        'social_media',
        'applicant_position',
        'authorization_document',
        'purpose',
        'owner_id',
        'status',
        'rejection_reason',
        'verification_status',
        'verification_notes',
        'verified_at',
        'pic_name',
        'instagram',
        'linkedin',
        'location',
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

    public function members(): HasMany
    {
        return $this->hasMany(OrganizationMember::class);
    }

    public function brands(): HasMany
    {
        return $this->hasMany(Brand::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(OrganizationDocument::class);
    }

    public function roleHistories(): HasMany
    {
        return $this->hasMany(OrganizationRoleHistory::class);
    }

    public function setting(): HasOne
    {
        return $this->hasOne(OrganizationSetting::class);
    }

    public function verificationHistories(): HasMany
    {
        return $this->hasMany(OrganizationVerificationHistory::class);
    }

    public function legalUpdateRequests(): HasMany
    {
        return $this->hasMany(OrganizationLegalUpdateRequest::class);
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
}
