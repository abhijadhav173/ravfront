<?php

namespace App\Mail;

use App\Models\FormSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FormThankYouMail extends Mailable
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
            ->subject('Thank you for your submission')
            ->view('emails.form_thank_you', [
                'submission' => $this->submission,
                'brandName' => $this->fromName ?: 'RAVOK',
                'brandColor' => '#A98147',
            ]);
    }
}

