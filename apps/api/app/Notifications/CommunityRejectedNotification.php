<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommunityRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $user,
        private string $communityName,
        private ?string $reason = null
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Komunitas Ditolak - KomunaID')
            ->greeting("Halo {$this->user->full_name ?? $this->user->username}!")
            ->line("Komunitas \"{$this->communityName}\" ditolak.");

        if ($this->reason) {
            $message->line("Alasan: {$this->reason}");
        }

        return $message
            ->line('Silakan perbaiki dan ajukan ulang.')
            ->action('Lihat Dashboard', config('app.frontend_url') . '/dashboard');
    }
}
