<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'type',
        'file_path',
        'mime_type',
        'file_size',
        'uploaded_by',
        'status',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
