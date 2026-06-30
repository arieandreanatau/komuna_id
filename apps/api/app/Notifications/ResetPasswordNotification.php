<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $user,
        private string $token
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = config('app.frontend_url', 'http://localhost:3000')."/reset-password?token={$this->token}&email={$this->user->email}";

        return (new MailMessage)
            ->subject('Reset Password - KomunaID')
            ->greeting('Halo '.($this->user->full_name ?? $this->user->username).'!')
            ->line('Kami menerima permintaan untuk mereset password akun Anda.')
            ->line('Klik tombol di bawah ini untuk mereset password:')
            ->action('Reset Password', $resetUrl)
            ->line('Link ini akan kedaluwarsa dalam 60 menit.')
            ->line('Jika Anda tidak meminta reset password, abaikan email ini.');
    }
}
