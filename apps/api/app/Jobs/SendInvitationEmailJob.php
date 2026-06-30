<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\User;
use App\Services\EmailNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendInvitationEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly string $inviterName,
        public readonly string $roleName,
        public readonly string $token,
    ) {}

    public function handle(): void
    {
        EmailNotificationService::sendInvitation($this->user, $this->inviterName, $this->roleName, $this->token);
    }
}
