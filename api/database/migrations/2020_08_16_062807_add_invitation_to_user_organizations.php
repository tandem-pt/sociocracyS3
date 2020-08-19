<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInvitationToUserOrganizations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_organizations', function (Blueprint $table) {
            $table->string('email')->nullable();
            $table->datetime('accepted_at')->nullable()->default(null);
            $table->string('invitation_token')->nullable()->default(
                bin2hex(random_bytes(16))
            );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_organizations', function (Blueprint $table) {
            $table->dropColumn('email');
            $table->dropColumn('accepted_at');
            $table->dropColumn('invitation_token');
        });
    }
}
