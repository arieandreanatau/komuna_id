<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BrandDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'brand_id',
        'name',
        'type',
        'file_path',
        'mime_type',
        'file_size',
        'uploaded_by',
        'status',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}
