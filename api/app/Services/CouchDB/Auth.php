<?php
namespace App\Services\CouchDB;

use App\Contracts\CouchDB\Auth as AuthInterface;
use \App\JWT\Decoder;
use Firebase\JWT\JWT;
use \App\Services\UserRepository;

class Auth implements AuthInterface
{
    protected $userRepository;
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    public function createJWT($oauth_jwt)
    {
        $idToken = Decoder::decode($oauth_jwt);
        $user = $this->userRepository->get();
        $payload = [
             "sub" => $idToken->sub,
             "aud" => $idToken->aud,
             "iat" => $idToken->iat,
             "exp" => $idToken->exp,
             "_couchdb.roles" => $user->roles(),
             "https://sociocracy30.io/userDB" => $user->databaseName()
         ];
        
        return JWT::encode($payload, base64_decode(getenv('COUCHDB_SECRET_KEY')));
    }
}
