<?php

namespace App\Mail;

use App\Models\DataRoom;
use App\Models\RoomVisitor;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RoomVisitorNotifyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public DataRoom $room,
        public RoomVisitor $visitor,
        public string $fromAddress,
        public string $fromName
    ) {
        //
    }

    public function build(): self
    {
        return $this
            ->from($this->fromAddress, $this->fromName)
            ->subject($this->visitor->name.' opened '.$this->room->name)
            ->view('emails.room_visitor_notify', [
                'room' => $this->room,
                'visitor' => $this->visitor,
                'brandName' => $this->fromName ?: 'RAVOK',
                'brandColor' => '#A98147',
            ]);
    }
}
