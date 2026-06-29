<?php

declare(strict_types=1);

namespace App\Enums;

enum CollaborationStatus: string
{
    case INQUIRY = 'inquiry';
    case PROPOSAL = 'proposal';
    case NEGOTIATION = 'negotiation';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case ARCHIVED = 'archived';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::INQUIRY => 'Inquiry',
            self::PROPOSAL => 'Proposal',
            self::NEGOTIATION => 'Negotiation',
            self::ACTIVE => 'Active',
            self::COMPLETED => 'Completed',
            self::ARCHIVED => 'Archived',
            self::REJECTED => 'Rejected',
        };
    }
}
