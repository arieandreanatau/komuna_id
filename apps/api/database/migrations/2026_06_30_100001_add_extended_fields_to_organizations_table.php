<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('type')->nullable()->after('name');
            $table->string('legal_name')->nullable()->after('type');
            $table->json('social_media')->nullable()->after('website');
            $table->string('applicant_position')->nullable()->after('social_media');
            $table->text('authorization_document')->nullable()->after('applicant_position');
            $table->text('purpose')->nullable()->after('authorization_document');
            $table->string('verification_status')->default('unverified')->after('status');
            $table->text('verification_notes')->nullable()->after('verification_status');
            $table->timestamp('verified_at')->nullable()->after('verification_notes');
        });
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn([
                'type', 'legal_name', 'social_media', 'applicant_position',
                'authorization_document', 'purpose', 'verification_status',
                'verification_notes', 'verified_at',
            ]);
        });
    }
};
