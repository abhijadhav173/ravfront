<?php

namespace App\Mail;

use App\Models\FormSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FormAdminNotifyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public FormSubmission $submission,
        public string $fromAddress,
        public string $fromName
    ) {
        //
    }

    public function build(): self
    {
        return $this
            ->from($this->fromAddress, $this->fromName)
            ->subject('New '.$this->submission->type.' submission')
            ->view('emails.form_admin_notify', [
                'submission' => $this->submission,
                'brandName' => $this->fromName ?: 'RAVOK',
                'brandColor' => '#A98147',
            ]);
    }
}

