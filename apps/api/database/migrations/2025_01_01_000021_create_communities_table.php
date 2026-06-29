<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communities', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('cover_image')->nullable();
            $table->string('logo')->nullable();
            $table->foreignId('category_id')->constrained('community_categories')->cascadeOnDelete();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['draft', 'pending_review', 'approved', 'rejected', 'revision_needed', 'archived'])->default('draft');
            $table->text('rejection_reason')->nullable();
            $table->string('website')->nullable();
            $table->string('location')->nullable();
            $table->integer('member_count')->default(0);
            $table->boolean('is_public')->default(true);
            $table->enum('join_mode', ['open', 'approval_required', 'invite_only'])->default('open');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communities');
    }
};
