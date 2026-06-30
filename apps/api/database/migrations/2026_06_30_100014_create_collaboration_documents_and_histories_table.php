<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('collaborations', function (Blueprint $table) {
            $table->text('proposal_document')->nullable()->after('description');
            $table->foreignId('organization_id')->nullable()->after('proposal_document')->constrained()->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->after('organization_id')->constrained()->nullOnDelete();
        });

        Schema::create('collaboration_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collaboration_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->comment('proposal, contract, report, other');
            $table->string('file_path');
            $table->string('mime_type')->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('collaboration_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collaboration_id')->constrained()->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('notes')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collaboration_status_histories');
        Schema::dropIfExists('collaboration_documents');
        Schema::table('collaborations', function (Blueprint $table) {
            $table->dropColumn(['proposal_document', 'organization_id', 'brand_id']);
        });
    }
};
