<?php
namespace App\Services;

use \App\JWT\Decoder;
use Firebase\JWT\JWT;
use PHPOnCouch\Couch;
use PHPOnCouch\CouchClient;
use PHPOnCouch\CouchAdmin;

class CouchDB
{
    private static $inst = null;

    public static function inst()
    {
        if (self::$inst === null) {
            self::$inst = new CouchDB();
        }
        return self::$inst;
    }

    public function createJWT($oauth_jwt)
    {
        \Firebase\JWT\JWT::$leeway = 10;
        $idToken = Decoder::decode($oauth_jwt);
        $user = User::inst($idToken->sub);
        $payload = [
             "sub" => $idToken->sub,
             "aud" => $idToken->aud,
             "iat" => $idToken->iat,
             "exp" => $idToken->exp,
             "_couchdb.roles" => $user->roles(),
             "dbNames" => $user->organizationNames(),
             "https://sociocracy30.io/userDB" => $user->databaseName()
         ];
        
        return JWT::encode($payload, base64_decode(getenv('COUCHDB_SECRET_KEY')));
    }
}
