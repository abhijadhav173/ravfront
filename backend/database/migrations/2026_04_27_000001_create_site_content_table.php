<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Single-row site content store. One row per page slug ("home", "about-us", ...).
 * `content` is a JSON blob holding all editable fields for that page.
 *
 * MVP design: per-page row, generic JSON column. Cheap to query, cheap to update,
 * extensible without new migrations as the editable surface grows.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('site_content', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_content');
    }
};
