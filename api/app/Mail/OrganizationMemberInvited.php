<?php

namespace App\Mail;

use App\UserOrganization;
use App\OrganizationMeta;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrganizationMemberInvited extends Mailable
{
    use Queueable, SerializesModels;

    public $organization;
    public $invitation_link;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(UserOrganization $invitation, OrganizationMeta $organization)
    {
        $this->organization = $organization;
        $this->invitation_link = getenv('APP_FRONT_URL') . '/participate?' . http_build_query([
            'invitation_id' => $invitation->id,
            'token' => $invitation->invitation_token
        ]);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $config = array_merge(config('beautymail.view'), config('beautymail'));
        return $this->view('emails.organization_member.invited', $config)
            ->text('emails.organization_member.invited_plain');
    }
}
