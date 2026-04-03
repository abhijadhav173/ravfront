<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            $host = DB::table('settings')->where('key', 'mail_host')->value('value');
            $port = DB::table('settings')->where('key', 'mail_port')->value('value');
            $username = DB::table('settings')->where('key', 'mail_username')->value('value');
            $password = DB::table('settings')->where('key', 'mail_password')->value('value');
            $encryption = DB::table('settings')->where('key', 'mail_encryption')->value('value');
            $fromAddress = DB::table('settings')->where('key', 'mail_from_address')->value('value');
            $fromName = DB::table('settings')->where('key', 'mail_from_name')->value('value');
            if ($host && $port && $username && $password) {
                try {
                    $password = Crypt::decryptString($password);
                } catch (\Throwable $e) {
                    // keep original if not decryptable (e.g., plaintext)
                }
                Config::set('mail.default', 'smtp');
                Config::set('mail.mailers.smtp.host', $host);
                Config::set('mail.mailers.smtp.port', (int) $port);
                Config::set('mail.mailers.smtp.username', $username);
                Config::set('mail.mailers.smtp.password', $password);
                Config::set('mail.mailers.smtp.encryption', $encryption ?: null);
                Config::set('mail.mailers.smtp.scheme', $encryption === 'ssl' ? 'smtps' : null);
            }
            if ($fromAddress) {
                Config::set('mail.from.address', $fromAddress);
            }
            if ($fromName) {
                Config::set('mail.from.name', $fromName);
            }
        } catch (\Throwable $e) {
        }
    }
}
