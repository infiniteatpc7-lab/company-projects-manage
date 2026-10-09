<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('servers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('provider')->nullable();
            $table->string('managed_by');
            $table->string('ip_address')->nullable();
            $table->string('plan')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('renewal_date')->nullable()->index();
            $table->decimal('renewal_cost', 10, 2)->nullable();
            $table->string('status')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('servers');
    }
};
