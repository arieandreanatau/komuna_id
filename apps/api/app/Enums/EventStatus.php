<?php

declare(strict_types=1);

namespace App\Enums;

enum EventStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case CANCELLED = 'cancelled';
    case ARCHIVED = 'archived';
    case PENDING_REVIEW = 'pending_review';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::PUBLISHED => 'Published',
            self::CANCELLED => 'Cancelled',
            self::ARCHIVED => 'Archived',
            self::PENDING_REVIEW => 'Pending Review',
            self::COMPLETED => 'Completed',
        };
    }
}
