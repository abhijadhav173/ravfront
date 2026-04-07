<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use App\Mail\FormAdminNotifyMail;
use App\Models\FormSubmission;

class SettingsController extends Controller
{
    private const MAIL_KEYS = [
        'mail_driver',
        'mail_host',
        'mail_port',
        'mail_username',
        'mail_password',
        'mail_encryption',
        'mail_from_address',
        'mail_from_name',
        'mail_admin_to',
    ];

    private static function get(string $key): ?string
    {
        $row = DB::table('settings')->where('key', $key)->first();
        if (! $row || $row->value === null) {
            return null;
        }
        if ($key === 'mail_password') {
            try {
                return Crypt::decryptString($row->value);
            } catch (\Throwable) {
                return null;
            }
        }
        return $row->value;
    }

    private static function set(string $key, ?string $value): void
    {
        if ($key === 'mail_password' && $value !== null && $value !== '') {
            $value = Crypt::encryptString($value);
        }
        DB::table('settings')->updateOrInsert(
            ['key' => $key],
            ['value' => $value, 'updated_at' => now()]
        );
    }

    private static function mailArray(): array
    {
        return [
            'mail_driver' => self::get('mail_driver') ?? 'smtp',
            'mail_host' => self::get('mail_host') ?? '',
            'mail_port' => self::get('mail_port') ?? '587',
            'mail_username' => self::get('mail_username') ?? '',
            'mail_password' => '', // Never expose stored password
            'mail_encryption' => self::get('mail_encryption') ?? 'tls',
            'mail_from_address' => self::get('mail_from_address') ?? '',
            'mail_from_name' => self::get('mail_from_name') ?? '',
            'mail_admin_to' => self::get('mail_admin_to') ?? '',
        ];
    }

    public function mail(): JsonResponse
    {
        return response()->json(self::mailArray());
    }

    public function updateMail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mail_driver' => ['sometimes', 'string', Rule::in(['smtp'])],
            'mail_host' => ['nullable', 'string', 'max:255'],
            'mail_port' => ['nullable', 'string', 'max:10'],
            'mail_username' => ['nullable', 'string', 'max:255'],
            'mail_password' => ['nullable', 'string', 'max:255'],
            'mail_encryption' => ['nullable', 'string', Rule::in(['tls', 'ssl', ''])],
            'mail_from_address' => ['nullable', 'string', 'email', 'max:255'],
            'mail_from_name' => ['nullable', 'string', 'max:255'],
            'mail_admin_to' => ['nullable', 'string', 'email', 'max:255'],
        ]);

        foreach (self::MAIL_KEYS as $key) {
            $requestKey = $key;
            if (! array_key_exists($requestKey, $validated)) {
                continue;
            }
            $value = $validated[$requestKey];
            if ($key === 'mail_password' && ($value === null || $value === '')) {
                continue; // Do not overwrite with empty
            }
            if ($key === 'mail_encryption' && $value === '') {
                $value = null;
            }
            self::set($key, $value === '' ? null : (string) $value);
        }

        return response()->json(self::mailArray());
    }

    public function testMail(Request $request): JsonResponse
    {
        $to = DB::table('settings')->where('key', 'mail_admin_to')->value('value')
            ?: DB::table('settings')->where('key', 'mail_from_address')->value('value');
        $fromAddress = DB::table('settings')->where('key', 'mail_from_address')->value('value') ?? config('mail.from.address');
        $fromName = DB::table('settings')->where('key', 'mail_from_name')->value('value') ?? config('mail.from.name');
        if (! $to || ! $fromAddress) {
            return response()->json(['message' => 'Missing admin or from email.'], 422);
        }
        try {
            // Reuse admin notify template with a minimal unsaved Eloquent model
            $submission = new FormSubmission([
                'id' => 0,
                'type' => 'test',
                'name' => 'SMTP Test',
                'email' => $to,
                'data' => ['Message' => 'If you see this, SMTP is working.'],
                'created_at' => now(),
            ]);
            Mail::to($to)->send(new FormAdminNotifyMail($submission, $fromAddress, $fromName));
            return response()->json(['message' => 'Test email sent to '.$to]);
        } catch (\Throwable $e) {
            Log::error('Test mail failed: '.$e->getMessage());
            return response()->json(['message' => 'Test email failed: '.$e->getMessage()], 500);
        }
    }
}
