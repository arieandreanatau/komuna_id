<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RoleRequestApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $user,
        private string $roleName
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Permintaan Role Disetujui - KomunaID')
            ->greeting("Halo {$this->user->name}!")
            ->line("Permintaan role \"{$this->roleName}\" Anda telah disetujui.")
            ->line('Anda sekarang dapat mengakses fitur yang sesuai dengan role tersebut.')
            ->action('Buka Dashboard', config('app.frontend_url') . '/dashboard');
    }
}
