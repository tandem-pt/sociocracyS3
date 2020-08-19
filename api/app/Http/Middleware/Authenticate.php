<?php

namespace App\Http\Middleware;

use Closure;
use Auth0\SDK\Exception\InvalidTokenException;
use Auth0\SDK\Helpers\JWKFetcher;
use Auth0\SDK\Helpers\Tokens\AsymmetricVerifier;
use Auth0\SDK\Helpers\Tokens\TokenVerifier;

class Authenticate
{
   
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json('No token provided', 401);
        }
        $this->validateToken($token);

        return $next($request);
    }

    public function validateToken($token)
    {
        try {
            $jwksUri = env('OAUTH2_DOMAIN') . '.well-known/jwks.json';
            $jwksFetcher = new JWKFetcher(null, [ 'base_uri' => $jwksUri ]);
            $signatureVerifier = new AsymmetricVerifier($jwksFetcher);
            $tokenVerifier = new TokenVerifier(env('OAUTH2_DOMAIN'), env('OAUTH2_AUD'), $signatureVerifier);

            $decoded = $tokenVerifier->verify($token);
        } catch (InvalidTokenException $e) {
            throw $e;
        };
    }
}
