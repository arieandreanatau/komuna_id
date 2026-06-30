<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (User $user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'uuid',
        'username',
        'full_name',
        'email',
        'phone_number',
        'password',
        'status',
        'verification_level',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'identity_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class,
            'verification_level' => 'integer',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function roles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }

    public function communities(): HasMany
    {
        return $this->hasMany(CommunityMember::class);
    }

    public function ownedCommunities(): HasMany
    {
        return $this->hasMany(Community::class, 'owner_id');
    }

    public function communityRoleAssignments(): HasMany
    {
        return $this->hasMany(CommunityRoleAssignment::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function blockedUsers(): HasMany
    {
        return $this->hasMany(UserBlock::class);
    }

    public function isBlockedBy(int $userId): bool
    {
        return $this->blockedUsers()->where('blocked_id', $userId)->exists();
    }

    public function hasBlocked(int $userId): bool
    {
        return $this->blockedUsers()->where('blocked_id', $userId)->exists();
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::ACTIVE;
    }

    public function isAdmin(): bool
    {
        return $this->roles()
            ->where('is_active', true)
            ->whereHas('role', fn ($q) => $q->where('scope', 'platform')
                ->whereIn('slug', ['super-admin', 'platform-admin', 'moderator']))
            ->exists();
    }

    public function isCommunityOwner(int $communityId): bool
    {
        return Community::where('id', $communityId)->where('owner_id', $this->id)->exists();
    }

    public function hasCommunityRole(int $communityId, string $roleSlug): bool
    {
        return CommunityRoleAssignment::where('community_id', $communityId)
            ->where('user_id', $this->id)
            ->where('is_active', true)
            ->whereHas('role', fn ($q) => $q->where('slug', $roleSlug))
            ->exists();
    }

    public function getCommunityRole(int $communityId): ?string
    {
        if ($this->isCommunityOwner($communityId)) {
            return 'community-owner';
        }

        $assignment = CommunityRoleAssignment::with('role')
            ->where('community_id', $communityId)
            ->where('user_id', $this->id)
            ->where('is_active', true)
            ->first();

        return $assignment?->role?->slug;
    }

    public function canManageCommunity(int $communityId): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        if ($this->isCommunityOwner($communityId)) {
            return true;
        }

        if ($this->hasCommunityRole($communityId, 'community-admin')) {
            return true;
        }

        return CommunityMember::where('community_id', $communityId)
            ->where('user_id', $this->id)
            ->whereIn('role', ['admin', 'moderator'])
            ->where('status', 'active')
            ->exists();
    }

    public function canManageCommunityEvents(int $communityId): bool
    {
        if ($this->canManageCommunity($communityId)) {
            return true;
        }

        return $this->hasCommunityRole($communityId, 'event-manager');
    }

    public function isEventAssignedManager(int $eventId): bool
    {
        return Event::where('id', $eventId)
            ->where('organizer_id', $this->id)
            ->exists();
    }
}
