<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvitationNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $user,
        private string $inviterName,
        private string $roleName,
        private string $token
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = config('app.frontend_url')."/invitations/{$this->token}/accept";

        return (new MailMessage)
            ->subject('Anda Diundang ke KomunaID!')
            ->greeting('Halo!')
            ->line("{$this->inviterName} mengundang Anda untuk bergabung dengan role \"{$this->roleName}\".")
            ->action('Terima Undangan', $acceptUrl)
            ->line('Jika Anda tidak ingin bergabung, abaikan email ini.');
    }
}
