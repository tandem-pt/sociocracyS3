<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class UserOrganization extends Model
{
    protected $table = "user_organizations";
    protected $fillable = [
        "user_id",
        "organization"
    ];
    public $timestamps = true;
}
