<?php

return [

    /*
    |--------------------------------------------------------------------------
    |   Your auth0 domain
    |--------------------------------------------------------------------------
    |   As set in the auth0 administration page
    |
    */
    'domain'        => env('OAUTH2_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    |   Your APP id
    |--------------------------------------------------------------------------
    |   As set in the auth0 administration page
    |
    */
    'client_id'     => env('OAUTH2_CLIENT_ID'),


    /*
    |--------------------------------------------------------------------------
    |   Persistence Configuration
    |--------------------------------------------------------------------------
    |   persist_user            (Boolean) Optional. Indicates if you want to persist the user info, default true
    |   persist_access_token    (Boolean) Optional. Indicates if you want to persist the access token, default false
    |   persist_refresh_token   (Boolean) Optional. Indicates if you want to persist the refresh token, default false
    |   persist_id_token        (Boolean) Optional. Indicates if you want to persist the id token, default false
    |
    */
    'persist_user' => false,
    'persist_access_token' => false,
    'persist_refresh_token' => false,
    'persist_id_token' => false,

    /*
    |--------------------------------------------------------------------------
    |   The authorized token issuers
    |--------------------------------------------------------------------------
    |   This is used to verify the decoded tokens when using RS256
    |
    */
    'authorized_issuers'  => [ "https://". env('OAUTH2_DOMAIN') ],

    /*
    |--------------------------------------------------------------------------
    |   The authorized token audiences
    |--------------------------------------------------------------------------
    |
    */
    'api_identifier'  => env('OAUTH2_CLIENT_ID'),

    /*
    |--------------------------------------------------------------------------
    |   The secret format
    |--------------------------------------------------------------------------
    |   Used to know if it should decode the secret when using HS256
    |
    */
    'secret_base64_encoded'  => false,

    /*
    |--------------------------------------------------------------------------
    |   Supported algorithms
    |--------------------------------------------------------------------------
    |   Token decoding algorithms supported by your API
    |
    */
    'supported_algs'        => [ 'RS256' ],

    /*
    |--------------------------------------------------------------------------
    |   Guzzle Options
    |--------------------------------------------------------------------------
    |   guzzle_options    (array) optional. Used to specify additional connection options e.g. proxy settings
    |
    */
    // 'guzzle_options' => []
];
