<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->string('category')->nullable()->after('name');
            $table->string('banner')->nullable()->after('logo');
            $table->string('phone', 20)->nullable()->after('email');
            $table->json('social_media')->nullable()->after('phone');
            $table->string('main_products')->nullable()->after('social_media');
            $table->text('target_audience')->nullable()->after('main_products');
            $table->string('campaign_area')->nullable()->after('target_audience');
            $table->text('purpose')->nullable()->after('campaign_area');
            $table->text('ownership_proof')->nullable()->after('purpose');
            $table->string('verification_status')->default('unverified')->after('status');
            $table->text('verification_notes')->nullable()->after('verification_status');
            $table->timestamp('verified_at')->nullable()->after('verification_notes');
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            $table->dropColumn([
                'category', 'banner', 'phone', 'social_media', 'main_products',
                'target_audience', 'campaign_area', 'purpose', 'ownership_proof',
                'verification_status', 'verification_notes', 'verified_at',
            ]);
        });
    }
};
