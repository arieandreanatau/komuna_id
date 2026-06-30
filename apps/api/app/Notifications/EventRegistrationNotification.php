<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventRegistrationNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $user,
        private string $eventTitle
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Pendaftaran Event Berhasil - KomunaID')
            ->greeting('Halo '.($this->user->full_name ?? $this->user->username).'!')
            ->line("Anda telah berhasil mendaftar untuk event \"{$this->eventTitle}\".")
            ->line('Simpan email ini sebagai bukti pendaftaran.')
            ->action('Lihat Tiket Saya', config('app.frontend_url').'/dashboard/my-tickets');
    }
}
