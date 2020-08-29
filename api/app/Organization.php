<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $table = "organizations";
    protected $fillable = [
        "creator_id",
        "organization",
        "name"
    ];
    public $timestamps = true;
    
    public function users()
    {
        return $this->hasMany('App\UserOrganization');
    }
}
