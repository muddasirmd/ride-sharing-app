<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;
use Twilio\Rest\Client;


class LoginNeedsVerification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // return [TwilioChannel::class];
        return [];
    }


    public function send($notifiable)
    {
        $sid = env('TWILIO_ACCOUNT_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $twilio = new Client($sid, $token);

        $loginCode = rand( 100000, 999999);

        $notifiable->update([
            'login_code' => $loginCode
        ]);
    

        return $twilio->messages->create(
            "whatsapp:+923035015156",  // e.g., "whatsapp:+923035015156"
            [
                "from" => "whatsapp:" . env('TWILIO_WHATSAPP_FROM_SANDBOX'), // sandbox number
                "body" => "Your RSA login code is: {$loginCode}. Do not share it with anyone."
            ]
        );
    }

    // For SMS
    // public function toTwilio($notifiable){
        
    //     $loginCode = rand( 100000, 999999);
        

    //     $notifiable->update([
    //         'login_code' => $loginCode
    //     ]);
        
    //     return (new TwilioSmsMessage())->content("Your RSA login code is: {$loginCode}. Do not share it with anyone.");
    // }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
