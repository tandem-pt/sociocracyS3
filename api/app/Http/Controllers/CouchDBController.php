<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CouchDBController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/v1/couch/token",
     *     description="Create a token for a couchdb instance protected by JWT verification.",
     *     security={
     *         {"openId": {"openid": {}, "profile": {} }},
     *         {"bearer": {}}
     *     },
     *     externalDocs={"url":"https://docs.couchdb.org/en/stable/api/server/authn.html#jwt-authentication", "description":"CouchDB JWT Authorization documentation"},
     *     @OA\Response(
     *          response="201",
     *          description="A base64 encoded jwt token you can pass to a couch instance with `Authorization: Bearer <jwt>`",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="jwt",
     *                  type="string",
     *                  example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response="403",
     *          description="You should add Bearer header to your request",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="error",
     *                  type="string",
     *                  example="Forbidden"
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response="401",
     *          description="Issue while checkin given token (can be expired or issued from someone else.",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="error",
     *                  type="string",
     *                  example="Unauthorized"
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response="400",
     *          description="The token is malformed.",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="error",
     *                  type="string",
     *                  example="Bad data"
     *              )
     *          )
     *      )
     * )
     *
     */
    public function createToken(Request $request)
    {
        $jwt = $request->bearerToken();
        if (empty($jwt)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        if (!preg_match('/^([a-zA-Z0-9_=]{4,})\.([a-zA-Z0-9_=]{4,})\.([a-zA-Z0-9_\-\+\/=]{4,})/', $jwt)) {
            return response()->json(['error' => 'Bad data'], 400);
        }
        try {
            return response()->json([
                "jwt" => \App\Services\CouchDB::inst()->createJWT($jwt)
            ], 201);
        } catch (\Throwable $e) {
            if (($e instanceof \DomainException) || ($e instanceof \UnexpectedValueException) ||  ($e instanceof \InvalidArgumentException)) {
                return response()->json(['error' => 'Unauthorized', 'message' => $e->getMessage()], 401);
            }
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }
}
