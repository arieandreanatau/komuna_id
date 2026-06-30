<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommunityApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $user,
        private string $communityName
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Komunitas Disetujui - KomunaID')
            ->greeting("Halo {$this->user->full_name ?? $this->user->username}!")
            ->line("Komunitas \"{$this->communityName}\" telah disetujui.")
            ->line('Komunitas Anda sekarang sudah tampil di direktori publik.')
            ->action('Lihat Komunitas', config('app.frontend_url') . '/communities');
    }
}
