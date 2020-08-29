<?php
namespace App\Services;

use \Symfony\Component\HttpKernel\Exception\HttpException;
use App\UserOrganization;
use App\Organization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Log;
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

    public function joinOrganizationID($organizationID)
    {
        DB::table('user_organizations')->insertOrIgnore(
            [
                'organization_id' => $organizationID,
                'user_id' => $this->user->getAuthIdentifier(),
                'created_at' => now(),
                'updated_at' => now(),
                'accepted_at' => now(),
            ]
        );
    }
    public function joinOrganization($organizationName)
    {
        $organizationDatabase = $this->generateDBName($organizationName, 'org');
        DB::beginTransaction();
        try {
            DB::table('organizations')->insertOrIgnore(
                [
                    'database' => $organizationDatabase,
                    'name' => $organizationName,
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
            $organization = Organization::select('id')->where('database', $organizationDatabase)->firstOrFail();
            $this->joinOrganizationID($organization->id);
        } catch (ValidationException $e) {
            Log::error($e->getMessage());
            // Rollback and then redirect
            // back to form with errors
            DB::rollback();
            throw $e;
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            Log::error('ROLLBACK');
            DB::rollback();
            throw new HttpException(400, 'Bad data. ' . $e->getMessage());
        }
        DB::commit();

        return UserOrganization::where('user_organizations.user_id', Auth::user()->getAuthIdentifier())
        ->whereNotNull('accepted_at')
        ->join('organizations', 'organizations.id', 'user_organizations.organization_id')
        ->where('organizations.database', $organizationDatabase)
            ->select(
                'organizations.id as id',
                'user_organizations.accepted_at as accepted_at',
                'organizations.database as database',
                'organizations.name as name'
            )->firstOrFail();
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
    public function createOrganization($organizationName)
    {
        $organization = $this->generateDBName($organizationName, 'org');
        $client = $this->dbClient($organization);
        if (!$client->databaseExists()) {
            $client->createDatabase();
            $admin = $this->dbAdmin($client);
            $admin->addDatabaseMemberRole("admin.$organization");
        }
        return $this->joinOrganization($organizationName);
    }

    public static function invite(string $email, string $organizationID)
    {
        $match = UserOrganization::where('email', $email)
        ->where('organization_id', $organizationID);
        if ($match->exists()) {
            return $match->first();
        }
        $success = DB::table('user_organizations')->insertOrIgnore(
            [
                'email' => $email,
                'organization_id' => $organizationID,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        $invitation = UserOrganization::where('email', $email)->where('organization_id', $organizationID)->first();
        if (is_null($invitation)) {
            throw new HttpException(400, 'Invitation can not be created. ' . "[$email, $organization]");
        }
        $organization = Organization::find($organizationID);
        Mail::to($email)->send(new OrganizationMemberInvited($invitation, $organization));
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
        $admin = $this->dbAdmin($client);
        $admin->addDatabaseMemberRole($this->defaultRole());
    }

    public function defaultRole()
    {
        return "admin.{$this->databaseName}";
    }

    public function roles()
    {
        $organizations = Organization::select('database')
            ->join('user_organizations', 'user_organizations.organization_id', 'organizations.id')
            ->where('user_organizations.user_id', $this->user->getAuthIdentifier())
            ->get();
        $roles = $organizations->map(function ($org) {
            return 'admin.' . $org->database;
        });
        return array_merge(
            [$this->defaultRole()],
            $roles->toArray()
        );
    }
    
    public function databaseName()
    {
        return $this->databaseName;
    }
}
