<?php
namespace App\Services;

use \Symfony\Component\HttpKernel\Exception\HttpException;
use App\UserOrganization;
use App\OrganizationMeta;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

use Illuminate\Validation\ValidationException;
use PHPOnCouch\Couch;
use PHPOnCouch\CouchClient;
use PHPOnCouch\CouchAdmin;
use App\Mail\OrganizationMemberInvited;
use App\Contracts\UserContract;
use Auth;

class UserRepository
{
    private $databaseName = '';
    protected $user;

    public function get()
    {
        $this->user = Auth::user();
        $this->databaseName = $this->generateDBName(md5($this->user->getAuthIdentifier()), 'usr');
        $this->setupUserDatabase();
        return $this;
    }

    public function id()
    {
        return $this->user->getAuthIdentifier();
    }
    
    public function joinOrganization($organization, $sub=null)
    {
        DB::beginTransaction();
        try {
            DB::table('user_organizations')->insertOrIgnore(
                [
                    'user_id' => $this->user->getAuthIdentifier(),
                    'email' => $this->user->getEmail(),
                    'organization' => $organization,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'accepted_at' => now(),
                ]
            );
            if ($isCreating) {
                DB::table('organization_metas')->insert(
                    [
                        'creator_id' => $this->user->getAuthIdentifier(),
                        'organization' => $organization,
                        'name' => $organizationName,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }
        } catch (ValidationException $e) {
            // Rollback and then redirect
            // back to form with errors
            DB::rollback();
            throw $e;
        } catch (\Exception $e) {
            DB::rollback();
            throw new HttpException(400, 'Bad data. ' . $e->getMessage());
        }
        DB::commit();

        return $organization;
    }

    public function generateDBName($name, $prefix='org')
    {
        return $prefix . '-' . md5($name);
    }

    /**
     * Add user to an organization. Create the organization if it doesn't already exists.
     *
     * @param  string $organization
     * @return string the database added
     */
    public function createOrganization($organization)
    {
        $sub = $this->user->getAuthIdentifier();
        $client = $this->dbClient($organization);
        if (!$client->databaseExists()) {
            $client->createDatabase();
            $admin = $this->dbAdmin($client);
            $admin->addDatabaseMemberRole("admin.$organization");
        }

        return $this->joinOrganization($organization);
    }

    public static function invite(string $email, string $organization)
    {
        if (UserOrganization::where('email', $email)->where('organization', $organization)->exists()) {
            // Email already invited
            return UserOrganization::where('email', $email)->where('organization', $organization)->first();
        }
        $success = DB::table('user_organizations')->insertOrIgnore(
            [
                'email' => $email,
                'organization' => $organization,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        $invitation = UserOrganization::where('email', $email)->where('organization', $organization)->first();
        if (is_null($invitation)) {
            throw new HttpException(400, 'Invitation can not be created. ' . "[$email, $organization]");
        }
        $organizationMeta = OrganizationMeta::where('organization', $organization)->firstOrFail();
        if (is_null($organizationMeta)) {
            throw new HttpException(404, 'Organization '. $organization.'not found');
        }
        Mail::to($email)->send(new OrganizationMemberInvited($invitation, $organizationMeta));
        return $invitation;
    }

    
    private function dbClient($database=null)
    {
        if (is_null($database)) {
            $database = $this->databaseName;
        }
        $adminPassword = getenv('COUCHDB_PASSWORD');
        return new CouchClient("http://admin:$adminPassword@couchdb:5984/", $database);
    }

    private function dbAdmin($client = null)
    {
        if (is_null($client)) {
            $client = $this->dbClient();
        }
        return new CouchAdmin($client);
    }

    public function setupUserDatabase()
    {
        $client = $this->dbClient();
        if (!$client->databaseExists()) {
            $client->createDatabase();
        }
        $admin = $this->dbAdmin();
        $admin->addDatabaseMemberRole($this->defaultRole());
    }

    public function defaultRole()
    {
        return "admin.{$this->databaseName}";
    }

    public function roles()
    {
        $organizations = UserOrganization::select('organization')
            ->where('user_id', $this->user->getAuthIdentifier())
            ->get();
        $roles = $organizations->map(function ($org) {
            return 'admin.' . $org->organization;
        });
        return array_merge(
            [$this->defaultRole()],
            $roles->toArray()
        );
    }

    public function organizationNames()
    {
        return UserOrganization::select('name')
            ->where('user_id', $this->user->getAuthIdentifier())
            ->join('organization_metas', 'user_organizations.organization', '=', 'organization_metas.organization')
            ->select('organization_metas.name')
            ->get()
            ->map(function ($org) {
                return $org->name;
            })->flatten()->all();
    }
    
    public function databaseName()
    {
        return $this->databaseName;
    }
}
