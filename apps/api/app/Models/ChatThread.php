<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatThread extends Model
{
    protected $fillable = ['type', 'name', 'community_id', 'created_by'];

    public function community(): BelongsTo { return $this->belongsTo(Community::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function messages(): HasMany { return $this->hasMany(ChatMessage::class, 'thread_id'); }
}
