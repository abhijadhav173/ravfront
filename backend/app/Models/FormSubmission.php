<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'email',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}

