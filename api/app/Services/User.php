<?php
namespace App\Services;

use \Symfony\Component\HttpKernel\Exception\HttpException;
use App\UserOrganization;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use PHPOnCouch\Couch;
use PHPOnCouch\CouchClient;
use PHPOnCouch\CouchAdmin;

class User
{
    private static $inst = null;
    private $sub = null;
    private $databaseName = '';
    
    public static function inst($sub)
    {
        if (self::$inst === null) {
            self::$inst = new User($sub);
        }
        return self::$inst;
    }


    public function __construct($sub)
    {
        $this->sub = $sub;
        $this->databaseName = 'usr-' . md5($this->sub);
        $this->setup();
    }
    
    /**
     * Add user to an organization. Create the organization if it doesn't already exists.
     *
     * @param  string $organizationName
     * @return string the database added
     */
    public function addToOrganization($organizationName, $sub=null)
    {
        if (is_null($sub)) {
            $sub = $this->sub;
        }
        
        $organizationDatabase = 'org-' . md5($organizationName);
        $client = $this->dbClient($organizationDatabase);
        $isCreating = !$client->databaseExists();

        if ($isCreating && $sub !== $this->sub) {
            throw new HttpException(403, 'Forbidden');
        }
        if ($isCreating) {
            $client->createDatabase();
            $admin = $this->dbAdmin($client);
            $admin->addDatabaseMemberRole("admin.$organizationDatabase");
        } else {
            // Database already exists, be sure the authenticated user
            // is already assigned in the database.
            if (UserOrganization::where('user_id', $this->sub)->where('organization', $organizationDatabase)->doesntExist()) {
                throw new HttpException(403, 'Forbidden, DB already exists and you have no access to it.');
            }
        }
        DB::beginTransaction();
        try {
            DB::table('user_organizations')->insertOrIgnore(
                ['user_id' => $this->sub, 'organization' => $organizationDatabase]
            );
            if ($isCreating) {
                DB::table('organization_metas')->insert(
                    [
                        'creator_id' => $this->sub,
                        'organization' => $organizationDatabase,
                        'name' => $organizationName
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
        return $organizationDatabase;
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

    public function setup()
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
            ->where('user_id', $this->sub)
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
            ->where('user_id', $this->sub)
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
