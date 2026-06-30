<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable;

    public function __construct(private User $user)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Selamat Datang di KomunaID!')
            ->greeting("Halo {$this->user->full_name ?? $this->user->username}!")
            ->line('Selamat datang di KomunaID, platform ekosistem komunitas.')
            ->line('Akun Anda telah berhasil dibuat dan siap digunakan.')
            ->line('Mulai jelajahi komunitas, event, dan berbagai peluang kolaborasi.')
            ->action('Jelajahi Komunitas', config('app.frontend_url', 'http://localhost:3000') . '/communities')
            ->line('CONNECT • COMMUNITY • GROW');
    }
}
