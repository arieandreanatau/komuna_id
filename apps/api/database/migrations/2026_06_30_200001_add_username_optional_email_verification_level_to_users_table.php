<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('uuid');
            $table->string('full_name')->nullable()->after('username');
            $table->string('phone_number', 20)->nullable()->after('email');
            $table->tinyInteger('verification_level')->default(1)->after('status');
        });

        DB::statement('UPDATE users SET full_name = name WHERE full_name IS NULL');
        DB::statement('UPDATE users SET username = LOWER(REPLACE(name, " ", "_")) WHERE username IS NULL');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NULL');
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('uuid');
        });

        DB::statement('UPDATE users SET name = COALESCE(full_name, username)');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'full_name', 'phone_number', 'verification_level']);
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NOT NULL');
        }
    }
};
