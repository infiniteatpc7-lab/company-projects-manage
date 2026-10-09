<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('domain_name');
            $table->string('managed_by');
            $table->string('registrar')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('renewal_date')->nullable()->index();
            $table->decimal('renewal_cost', 10, 2)->nullable();
            $table->boolean('auto_renew')->default(false);
            $table->string('status')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('domains');
    }
};
