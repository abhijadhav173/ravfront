<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => '<IfModule mod_rewrite.c>
  RewriteEngine On

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteCond %{REQUEST_URI} !\.[a-zA-Z0-9]{2,4}$ [NC]
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.+)/$ $1.html [L]

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(.+)$ $1.html [L]

  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ backend/public/index.php [L]
</IfModule>'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_APPROVED,
            ]
        );
    }
}
