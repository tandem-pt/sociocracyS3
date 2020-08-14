<?php
namespace App\JWT;

use Illuminate\Support\Facades\Cache;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;

class Decoder
{
    public static function decode($jwt)
    {
        return JWT::decode(
            $jwt,
            self::keySet(),
            ['RS256']
        );
    }

    private static function keySet()
    {
        $serializedJwks = null;
        if (Cache::has('auth2_jwks')) {
            $serializedJwks = Cache::get('auth2_jwks');
        } else {
            if (!getenv('OAUTH2_DOMAIN')) {
                throw new \Exception('Missing OAUTH2_DOMAIN env key');
            }
            $tokenIssuer = 'https://' . getenv('OAUTH2_DOMAIN');
            $serializedJwks = file_get_contents($tokenIssuer . '/.well-known/jwks.json');
            // Save keySet for 1 day
            Cache::put('auth2_jwks', $serializedJwks, 86400);
        }
        
        $jwkSet = json_decode(
            $serializedJwks,
            true
        );
        return JWK::parseKeySet($jwkSet);
    }
}
