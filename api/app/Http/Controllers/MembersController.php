<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserRepository;
use \Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Validation\ValidationException;
use App\UserOrganization;

class MembersController extends Controller
{
    protected $userRepository;
    public function __construct(UserRepository $repository)
    {
        $this->userRepository = $repository;
    }
    /**
     * @OA\Get(
     *     path="/api/v1/members",
     *     description="Get all members for an organization",
     *     tags={"Organization"},
     *     @OA\Response(
     *          response="200",
     *          description="Invitation details",
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
    public function index(Request $request)
    {
        $this->validate($request, [
            'organization' => 'required',
        ]);

        $organization = $request->input('organization');
        $members = UserOrganization::where('organization', $organization)->whereNotNull('email');
        return response()->json($members->get());
    }

    
    /**
     * @OA\Get(
     *     path="/api/v1/members/:invitation_id",
     *     description="Get member details from an invitation",
     *     tags={"Organization"},
     *     @OA\Response(
     *          response="200",
     *          description="Invitation details",
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
    public function get(Request $request, $invitation_id)
    {
        $this->validate($request, [
            'token' => 'required',
        ]);
        $token = $request->input('token');
        $invitation_id = intval($invitation_id);
        $invitation = UserOrganization::where('invitation_token', $token)
            ->where('user_organizations.id', $invitation_id)
            ->join('organization_metas', 'organization_metas.organization', 'user_organizations.organization')
            ->select(
                'user_organizations.id as invitation_id',
                'user_organizations.user_id as user_id',
                'organization_metas.organization as organization_id',
                'organization_metas.name as organization_name',
                'accepted_at',
                'email'
            )->firstOrFail();
        return response()->json($invitation);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/members/:invitation_id",
     *     description="Update member invitation details",
     *     tags={"Organization"},
     *     @OA\Response(
     *          response="200",
     *          description="Invitation details",
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
    public function update(Request $request, $invitation_id)
    {
        $inputs = $request->only(['name']);
        $user = $this->userRepository->get();

        $this->validate($request, [
            'token' => 'required'
        ]);
        $token = $request->input('token');
        $invitation_id = intval($invitation_id);
        $invitation = UserOrganization::where('invitation_token', $token)
            ->where('user_organizations.id', $invitation_id)->firstOrFail();

        if (empty($request->input('accepted_at'))) {
            $invitation->accepted_at = null;
        } else {
            $invitation->accepted_at = (new \DateTime())->format('Y-m-d H:i');
            $invitation->invitation_token = null;
            $invitation->user_id = $user->id();
            $user->joinOrganization($invitation->organization);
        }
        $invitation->save();
        
        $invitation = UserOrganization::join('organization_metas', 'organization_metas.organization', 'user_organizations.organization')
        ->select(
            'user_organizations.id as invitation_id',
            'user_organizations.user_id as user_id',
            'organization_metas.name as organization_name',
            'organization_metas.organization as organization_id',
            'user_organizations.accepted_at as accepted_at',
            'user_organizations.email as email'
        )->findOrFail($invitation->id);
        return response()->json($invitation);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/members/bulks",
     *     description="Create or delete invitation by bulks, depending on given `command`  ",
     *     security={
     *         {"openId": {"openid": {}, "profile": {} }},
     *         {"bearer": {}}
     *     },
     *     tags={"Organization"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="bulks",
     *                     type="array",
     *                     @OA\Items(
     *                      type="object",
     *                      @OA\Property(
     *                          property="command",
     *                          type="string",
     *                          enum={"create"}
     *                      ),
     *                      @OA\Property(
     *                          property="organization_id",
     *                          type="string",
     *                          description="Organization where the member is invited."
     *                      ),
     *                      @OA\Property(
     *                          property="email",
     *                          type="string",
     *                          description="Email to invite"
     *                      )
     *                    ),
     *                 ),
     *                 example={"_bulks": {{"command": "create", "organization_id": "org-as13iasdj", "email": "hadrien@tandem.pt"}}}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *          response="200",
     *          description="Docs answers",
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema(
     *                 @OA\Property(
     *                     property="docs",
     *                     type="array",
     *                     @OA\Items(ref="#/components/schemas/UserOrganization")
     *                 )
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
     *          description="Malformed query, probably malformated Authorization token or missing parameters.",
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
    public function bulks(Request $request)
    {
        try {
            $inputs = $request->only(['name']);
            $user = $this->userRepository->get();
            $this->validate($request, [
                'bulks' => 'required',
            ]);
            $bulks = $request->input('bulks');
            if (!is_array($bulks)) {
                return response()->json(['error' => 'bulks must be an array', 'errors' => $e->errors()], 400);
            }
            $response = [];
            foreach ($bulks as $invitationCommand) {
                if ($invitationCommand['command'] === 'create') {
                    $response[] = $this->userRepository->invite($invitationCommand['email'], $invitationCommand['organization_id']);
                }
            }
            return response()->json(['docs' => $response], 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage(), 'errors' => $e->errors()], 400);
        } catch (HttpException $e) {
            return response()->json(['error' => $e->getMessage()], $e->getStatusCode());
        } catch (\Exception $e) {
            if (($e instanceof \DomainException) || ($e instanceof \UnexpectedValueException) ||  ($e instanceof \InvalidArgumentException)) {
                return response()->json(['error' => 'Unauthorized', 'message' => $e->getMessage()], 401);
            }
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/v1/members",
     *     description="Invite a member to the organization specified `organizationID`. Will send an email to the invited member",
     *     security={
     *         {"openId": {"openid": {}, "profile": {} }},
     *         {"bearer": {}}
     *     },
     *     tags={"Organization"},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={"organization_id", "email"},
     *                 @OA\Property(
     *                     property="organization_id",
     *                     type="string",
     *                     description="Organization where the member is invited."
     *                 ),
     *                 @OA\Property(
     *                     property="email",
     *                     type="string",
     *                     description="Email to invite"
     *                 ),
     *                 example={"organization_id": "org-as13iasdj", "email": "hadrien@tandem.pt"}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *          response="201",
     *          description="The invited member",
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema(ref="#/components/schemas/UserOrganization"),
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
     *          description="Malformed query, probably malformated Authorization token or missing parameters.",
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
            $this->validate($request, [
                'email' => 'required|email',
                'organization_id' => 'required'
            ]);
            $this->userRepository->invite($request->input('email'), $request->input('organization_id'));
            return response()->json($user->invite($request->input('organization_id')), 201);
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
