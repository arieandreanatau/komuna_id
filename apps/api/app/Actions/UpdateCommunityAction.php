<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Community;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UpdateCommunityAction
{
    public function execute(array $data, int $id, Request $request): Community
    {
        $community = Community::findOrFail($id);

        if ($community->owner_id !== $request->user()->id) {
            abort(403, 'Tidak memiliki akses');
        }

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $oldValues = $community->only(array_keys($data));
        $community->update($data);

        AuditLogService::updated($community, $oldValues, $request);

        return $community->fresh();
    }
}
