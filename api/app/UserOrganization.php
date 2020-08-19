<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(@OA\Xml(name="UserOrganization"))
 */
class UserOrganization extends Model
{
    protected $table = "user_organizations";
    /**
     * @OA\Property(property="id", type="int64", example="23")
     * @OA\Property(property="created_at", type="datetime", example="2017-02-02 18:31:45")
     * @OA\Property(property="email", type="string", example="john@doe.com", description="email used to invite, empty if accepted")
     * @OA\Property(property="accepted_at", type="datetime", example="2017-02-02 18:31:45", description="If accepted, a date, if not `null`")
     */
    protected $fillable = [
        "user_id",
        "organization",
        "email",
        "accepted_at"
    ];

    protected $hidden = [
        "invitation_token"
    ];

    public $timestamps = true;
}
