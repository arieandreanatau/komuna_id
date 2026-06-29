<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RoleRequestRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $user,
        private string $roleName,
        private ?string $notes = null
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Permintaan Role Ditolak - KomunaID')
            ->greeting("Halo {$this->user->name}!")
            ->line("Permintaan role \"{$this->roleName}\" Anda telah ditolak.");

        if ($this->notes) {
            $message->line("Alasan: {$this->notes}");
        }

        return $message
            ->line('Anda dapat mengajukan permintaan baru jika diperlukan.')
            ->action('Lihat Profil', config('app.frontend_url') . '/dashboard/profile');
    }
}
