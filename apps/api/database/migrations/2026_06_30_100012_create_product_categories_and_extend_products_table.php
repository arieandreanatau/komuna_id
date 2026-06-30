<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('product_categories')) {
            Schema::create('product_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'brand_id')) {
                $table->foreignId('brand_id')->nullable()->after('id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('products', 'organization_id')) {
                $table->foreignId('organization_id')->nullable()->after('brand_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('products', 'category_id')) {
                $table->foreignId('category_id')->nullable()->after('organization_id')->constrained('product_categories')->nullOnDelete();
            }
            if (!Schema::hasColumn('products', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        if (!Schema::hasTable('product_images')) {
            Schema::create('product_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained()->cascadeOnDelete();
                $table->string('file_path');
                $table->string('alt_text')->nullable();
                $table->boolean('is_primary')->default(false);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_categories');
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['brand_id']);
            $table->dropForeign(['organization_id']);
            $table->dropForeign(['category_id']);
            $table->dropColumn(['brand_id', 'organization_id', 'category_id', 'price', 'currency', 'stock', 'status']);
            $table->dropSoftDeletes();
        });
    }
        Schema::table('products', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('products', 'brand_id')) $columnsToDrop[] = 'brand_id';
            if (Schema::hasColumn('products', 'organization_id')) $columnsToDrop[] = 'organization_id';
            if (Schema::hasColumn('products', 'category_id')) $columnsToDrop[] = 'category_id';
            if (!empty($columnsToDrop)) {
                $table->dropForeign($columnsToDrop);
                $table->dropColumn($columnsToDrop);
            }
            if (Schema::hasColumn('products', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};
