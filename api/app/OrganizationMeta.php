<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class OrganizationMeta extends Model
{
    protected $table = "organization_meta";
    protected $fillable = [
        "creator_id",
        "organization",
        "name"
    ];
    public $timestamps = true;
}
