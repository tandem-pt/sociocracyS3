<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\JWT\Decoder;
use App\Services\UserRepository;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Validation\ValidationException;
use Log;
use Auth;
use App\UserOrganization;

class OrganizationsController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @OA\Post(
     *     path="/api/v1/organizations",
     *     description="Create an organization for the given name.",
     *     tags={"Organization"},
     *     security={
     *         {"openId": {"openid": {}, "profile": {} }},
     *         {"bearer": {}}
     *     },
     *     @OA\Response(
     *          response="201",
     *          description="The created organization",
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="uuid",
     *                  type="string",
     *                  example="org-eyJzdWIiOiIxMjM0NTY3ODkw"
     *              ),
     *              @OA\Property(
     *                  property="id",
     *                  type="number",
     *                  example="13"
     *              ),
     *              @OA\Property(
     *                  property="name",
     *                  type="string",
     *                  example="FooBar"
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
        try {
            $inputs = $request->only(['name']);
            $user = $this->userRepository->get();
            if (!$request->has('name')) {
                return response()->json(['error' => 'Missing organization name'], 400);
            }

            return response()->json(
                $user->createOrganization($request->input('name')),
                201
            );
        } catch (ValidationException $e) {
            Log::error('ValidationException' . $e->getMessage());
            return response()->json(['error' => $e->getMessage(), 'errors' => $e->errors()], 400);
        } catch (HttpException $e) {
            Log::error('HttpException' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], $e->getStatusCode());
        } catch (\Exception $e) {
            Log::error('Exception' . $e->getMessage());
            if (($e instanceof \DomainException) || ($e instanceof \UnexpectedValueException) ||  ($e instanceof \InvalidArgumentException)) {
                return response()->json(['error' => 'Unauthorized', 'message' => $e->getMessage()], 401);
            }
            return response()->json(['error' => 'Server Error'], 500);
        }
    }

  
    /**
     * @OA\Get(
     *     path="/api/v1/organizations/:organization_id",
     *     description="Get organization details from an id",
     *     tags={"Organization"},
     *     @OA\Response(
     *          response="200",
     *          description="Organization details",
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema(ref="#/components/schemas/UserOrganization")
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
     *          description="Malformed query probably missing parameters.",
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
    public function get(Request $request, $organization_id)
    {
        $organization = UserOrganization::where('user_organizations.user_id', Auth::user()->getAuthIdentifier())
        ->where('user_organizations.organization', $organization_id)
        ->whereNotNull('accepted_at')
        ->join('organizations', 'organizations.organization', 'user_organizations.organization')
        ->select(
            'user_organizations.accepted_at as accepted_at',
            'organizations.id as id',
            'organizations.organization as uuid',
            'organizations.name as name'
        )->firstOrFail();
        return response()->json($organization);
    }
  
    /**
     * @OA\Get(
     *     path="/api/v1/organizations",
     *     description="Get organizations for the current user",
     *     tags={"Organization"},
     *     @OA\Response(
     *          response="200",
     *          description="Organization details",
     *          @OA\MediaType(
     *              mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="organizations",
     *                     type="array",
     *                     @OA\Items(
     *                      ref="#/components/schemas/UserOrganization"
     *                     )
     *                  )
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
     *          description="Malformed query probably missing parameters.",
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
    public function index(Request $request)
    {
        $organization = UserOrganization::where('user_organizations.user_id', Auth::user()->getAuthIdentifier())
        ->whereNotNull('accepted_at')
        ->join('organizations', 'organizations.id', 'user_organizations.organization_id')
        ->select(
            'user_organizations.accepted_at as accepted_at',
            'organizations.id as id',
            'organizations.database as database',
            'organizations.name as name'
        )->get();
        return response()->json(['organizations' =>  $organization]);
    }
}
