<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('investor_documents', function (Blueprint $table) {
            $table->string('group_key', 100)->nullable()->index()->after('uploaded_by');
            $table->string('original_name')->nullable()->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('investor_documents', function (Blueprint $table) {
            $table->dropColumn(['group_key', 'original_name']);
        });
    }
};
