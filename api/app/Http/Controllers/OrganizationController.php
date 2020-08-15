<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\JWT\Decoder;
use App\Services\User;
use \Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Validation\ValidationException;

;

class OrganizationController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/v1/organizations",
     *     description="Create an organization for the given name.",
     *     security={
     *         {"openId": {"openid": {}, "profile": {} }},
     *         {"bearer": {}}
     *     },
     *     @OA\Response(
     *          response="201",
     *          description="The created organization",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="id",
     *                  type="string",
     *                  example="org-eyJzdWIiOiIxMjM0NTY3ODkw"
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
    public function create(Request $request)
    {
        $jwt = $request->bearerToken();
        if (empty($jwt)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        if (!preg_match('/^([a-zA-Z0-9_=]{4,})\.([a-zA-Z0-9_=]{4,})\.([a-zA-Z0-9_\-\+\/=]{4,})/', $jwt)) {
            return response()->json(['error' => 'Bad data'], 400);
        }
        try {
            $inputs = $request->only(['name']);
            \Firebase\JWT\JWT::$leeway = 10;
            $userJWT = Decoder::decode($jwt);
            $user = User::inst($userJWT->sub);
            if (!$request->has('name')) {
                return response()->json(['error' => 'Missing organization name'], 400);
            }
            return response()->json([
               "id" => $user->addToOrganization($request->input('name'))
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage(), 'errors' => $e->errors()], 400);
        } catch (HttpException $e) {
            return response()->json(['error' => $e->getMessage()], $e->getStatusCode());
        } catch (\Exception $e) {
            if (($e instanceof \DomainException) || ($e instanceof \UnexpectedValueException) ||  ($e instanceof \InvalidArgumentException)) {
                return response()->json(['error' => 'Unauthorized', 'message' => $e->getMessage()], 401);
            }
            return response()->json(['error' => 'Server Error'], 500);
        }
    }
}
