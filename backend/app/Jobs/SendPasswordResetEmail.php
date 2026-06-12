<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;

class SendPasswordResetEmail implements ShouldQueue
{
    use Dispatchable, Queueable, SerializesModels;

    protected $user;
    protected $resetCode;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, $resetCode)
    {
        $this->user = $user;
        $this->resetCode = $resetCode;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Mail::to('quocviettt45@gmail.com')->send(new \App\Mail\PasswordResetMail($this->user, $this->resetCode));
    }
}
