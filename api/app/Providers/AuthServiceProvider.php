<?php
namespace App\Providers;

use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Auth0\SDK\Exception\InvalidTokenException;
use Auth0\SDK\Helpers\JWKFetcher;
use Auth0\SDK\Helpers\Tokens\AsymmetricVerifier;
use Auth0\SDK\Helpers\Tokens\TokenVerifier;
use Illuminate\Auth\GenericUser;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        $this->app['auth']->viaRequest('api', function ($request) {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json('No token provided', 401);
            }
            try {
                $jwksUri = env('OAUTH2_DOMAIN') . '.well-known/jwks.json';
                $jwksFetcher = new JWKFetcher(null, [ 'base_uri' => $jwksUri ]);
                $signatureVerifier = new AsymmetricVerifier($jwksFetcher);
                $tokenVerifier = new TokenVerifier(env('OAUTH2_DOMAIN'), env('OAUTH2_AUD'), $signatureVerifier);
                $decoded = $tokenVerifier->verify($token);
                $decoded['id'] = $decoded['sub'];
                return new GenericUser($decoded);
            } catch (InvalidTokenException $e) {
                throw $e;
            };
        });
    }
}
