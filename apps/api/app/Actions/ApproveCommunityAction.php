<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\CommunityStatus;
use App\Jobs\SendCommunityApprovedEmailJob;
use App\Models\Community;
use App\Services\AuditLogService;
use Illuminate\Http\Request;

class ApproveCommunityAction
{
    public function execute(int $id, ?string $notes, Request $request): Community
    {
        $community = Community::findOrFail($id);

        if ($community->status !== CommunityStatus::PENDING_REVIEW) {
            abort(422, 'Status komunitas tidak memungkinkan');
        }

        $community->update(['status' => CommunityStatus::APPROVED]);
        AuditLogService::approvalAction('approved', $community, $notes, $request);

        SendCommunityApprovedEmailJob::dispatch($community->owner, $community->name);

        return $community;
    }
}
