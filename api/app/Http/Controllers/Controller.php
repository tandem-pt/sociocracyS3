<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="Sociocracy30 API",
 *     version="0.0.1"
 * )
 * @OA\Tag(
 *   name="CouchDB",
 *   description="Authentication for CouchDB remote DB"
 * )
 * @OA\Tag(
 *   name="Organization",
 *   description="All about organization"
 * )
 * @OA\SecurityScheme(
 *     type="openIdConnect",
 *     name="Open ID Connect",
 *     securityScheme="openId",
 *     openIdConnectUrl=OIDC_DISCOVERY_URL
 * )
 * @OA\SecurityScheme(
 *     type="http",
 *     name="Bearer id_token",
 *     securityScheme="bearer",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
*/

class Controller extends BaseController
{
    //
}
