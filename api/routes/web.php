<?php

/** @var \Laravel\Lumen\Routing\Router $router */



/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});
$router->get('/locales/{locale:.*}.json', function ($locale) use ($router) {
    $filename = "../resources/views/locales/$locale.json";
    if (!file_exists($filename)) {
        abort(404, 'Locale ' . $locale . ' not found');
    }
    $file = file_get_contents($filename);
    $json = json_decode($file);
    if (json_last_error() !== JSON_ERROR_NONE) {
        abort(500, 'Malformated locale ' . $locale);
    }
    return response()->json($json, 200);
});
$router->group(['prefix' => 'api/v1'], function () use ($router) {
    $router->post('/organizations', ['uses' => 'OrganizationController@create']);
});

$router->group(['prefix' => 'api/v1/couch'], function () use ($router) {
    $router->post('/token', ['uses' => 'CouchDBController@createToken']);
});
