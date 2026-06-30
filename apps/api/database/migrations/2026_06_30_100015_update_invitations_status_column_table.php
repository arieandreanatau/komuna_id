<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            DB::statement("ALTER TABLE invitations ALTER COLUMN status VARCHAR(255) DEFAULT 'pending'");
        } else {
            DB::statement("ALTER TABLE invitations MODIFY COLUMN status VARCHAR(255) DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            DB::statement("ALTER TABLE invitations ALTER COLUMN status VARCHAR(255) DEFAULT 'pending'");
        } else {
            DB::statement("ALTER TABLE invitations MODIFY COLUMN status ENUM('pending','accepted','expired','cancelled') DEFAULT 'pending'");
        }
    }
};
