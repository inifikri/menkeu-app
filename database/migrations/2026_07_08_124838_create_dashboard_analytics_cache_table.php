<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dashboard_analytics_cache', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('data');
            $table->timestamps();
        });

        // Add index to transactions (date, user_id, category_id) if not already indexed
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('date');
            // user_id and category_id are foreignId which auto-create indexes, but let's make sure
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex(['date']);
        });

        Schema::dropIfExists('dashboard_analytics_cache');
    }
};
