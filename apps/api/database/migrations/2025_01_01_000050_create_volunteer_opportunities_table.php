<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained()->cascadeOnDelete();
            $table->foreignId('organizer_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('location')->nullable();
            $table->boolean('is_online')->default(false);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('max_volunteers')->nullable();
            $table->integer('current_volunteers')->default(0);
            $table->string('status', 20)->default('open');
            $table->string('skills_required')->nullable();
            $table->timestamps();

            $table->index('community_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_opportunities');
    }
};
