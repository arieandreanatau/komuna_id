<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('role_requests', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('role_requests', function (Blueprint $table) {
            $table->enum('status', ['draft', 'submitted', 'under_review', 'need_revision', 'approved', 'rejected', 'suspended'])->default('submitted')->after('role_id');
        });

        DB::statement("UPDATE role_requests SET status = 'under_review' WHERE status = 'pending'");
    }

    public function down(): void
    {
        Schema::table('role_requests', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('role_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected', 'revision'])->default('pending')->after('role_id');
        });
    }
};
