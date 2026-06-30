<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('communities', function (Blueprint $table) {
            $table->text('reason')->nullable()->after('location');
            $table->string('email')->nullable()->after('website');
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('instagram')->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('communities', function (Blueprint $table) {
            $table->dropColumn(['reason', 'email', 'phone', 'instagram']);
        });
    }
};
