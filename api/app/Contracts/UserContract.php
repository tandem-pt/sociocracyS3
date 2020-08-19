<?php
namespace App\Contracts;

use Illuminate\Contracts\Auth\Authenticatable;

interface UserContract extends Authenticatable
{
    public function getEmail();
}
