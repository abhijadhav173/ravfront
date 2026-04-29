<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $table = 'site_content';

    protected $fillable = ['slug', 'content', 'draft_content', 'published_at'];

    protected $casts = [
        'content' => 'array',
        'draft_content' => 'array',
        'published_at' => 'datetime',
    ];
}
