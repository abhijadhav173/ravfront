<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds draft/publish flow (#79) to site_content.
 *
 *   `content`         = published JSON (what the public site reads)
 *   `draft_content`   = optional in-progress edit (admin sees this when editing)
 *   `published_at`    = timestamp of last publish
 *
 * Save (admin PUT) writes to `draft_content`. Publish (admin POST .../publish)
 * promotes `draft_content` -> `content`, sets `published_at`, clears draft.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_content', function (Blueprint $table) {
            $table->json('draft_content')->nullable()->after('content');
            $table->timestamp('published_at')->nullable()->after('draft_content');
        });
    }

    public function down(): void
    {
        Schema::table('site_content', function (Blueprint $table) {
            $table->dropColumn(['draft_content', 'published_at']);
        });
    }
};
