<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AuditLogService
{
    public static function log(
        string $action,
        Model $model,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?Request $request = null
    ): AuditLog {
        return AuditLog::create([
            'user_id' => $request?->user()?->id,
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }

    public static function created(Model $model, ?Request $request = null): AuditLog
    {
        return self::log('created', $model, null, $model->toArray(), $request);
    }

    public static function updated(Model $model, array $oldValues, ?Request $request = null): AuditLog
    {
        return self::log('updated', $model, $oldValues, $model->toArray(), $request);
    }

    public static function deleted(Model $model, ?Request $request = null): AuditLog
    {
        return self::log('deleted', $model, $model->toArray(), null, $request);
    }

    public static function approvalAction(
        string $action,
        Model $model,
        ?string $notes = null,
        ?Request $request = null
    ): AuditLog {
        return self::log($action, $model, null, ['notes' => $notes], $request);
    }

    public static function roleChange(
        int $userId,
        string $action,
        ?array $oldRoles = null,
        ?array $newRoles = null,
        ?Request $request = null
    ): AuditLog {
        return AuditLog::create([
            'user_id' => $request?->user()?->id,
            'action' => $action,
            'auditable_type' => 'App\\Models\\User',
            'auditable_id' => $userId,
            'old_values' => $oldRoles,
            'new_values' => $newRoles,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }

    public static function authAction(string $action, int $userId, ?Request $request = null): AuditLog
    {
        return AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'auditable_type' => 'App\\Models\\User',
            'auditable_id' => $userId,
            'old_values' => null,
            'new_values' => null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }
}
