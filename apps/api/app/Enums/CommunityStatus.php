<?php

declare(strict_types=1);

namespace App\Enums;

enum CommunityStatus: string
{
    case DRAFT = 'draft';
    case PENDING_REVIEW = 'pending_review';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case REVISION_NEEDED = 'revision_needed';
    case ARCHIVED = 'archived';
    case TEMPORARILY_CLOSED = 'temporarily_closed';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::PENDING_REVIEW => 'Pending Review',
            self::APPROVED => 'Approved',
            self::REJECTED => 'Rejected',
            self::REVISION_NEEDED => 'Revision Needed',
            self::ARCHIVED => 'Archived',
            self::TEMPORARILY_CLOSED => 'Temporarily Closed',
        };
    }
}
