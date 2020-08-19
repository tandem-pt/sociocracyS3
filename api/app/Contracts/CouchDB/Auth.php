<?php
namespace App\Contracts\CouchDB;

use \App\JWT\Decoder;
use Firebase\JWT\JWT;
use PHPOnCouch\Couch;
use PHPOnCouch\CouchClient;
use PHPOnCouch\CouchAdmin;

interface Auth
{
    /**
     * createJWT Create a jwt for couch db `jwt_verification` from
     * a trusted OAuth2 jwt.
     *
     * @param  mixed $oauth_jwt
     * @return string signed jwt compatible with CouchDB configuration
     */
    public function createJWT($oauth_jwt);
}
