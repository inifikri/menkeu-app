<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('month'); // e.g. "2026-07"
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('category_name');
            $table->decimal('budget', 15, 2)->default(0);
            $table->decimal('spent', 15, 2)->default(0);
            $table->decimal('accuracy', 5, 2)->default(0); // Accuracy percentage
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_snapshots');
    }
};
