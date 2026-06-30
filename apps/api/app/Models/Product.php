<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'seller_id', 'community_id', 'name', 'description', 'price',
        'currency', 'category', 'status', 'stock', 'image',
    ];

    protected function casts(): array
    {
        return ['price' => 'decimal:2'];
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }
}
