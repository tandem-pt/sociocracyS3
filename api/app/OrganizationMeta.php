<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class OrganizationMeta extends Model
{
    protected $table = "organization_metas";
    protected $fillable = [
        "creator_id",
        "organization",
        "name"
    ];
    public $timestamps = true;
}
