<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('amc_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('amc_id')->constrained('amcs')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->date('due_date')->index();
            $table->date('collected_date')->nullable()->index();
            $table->string('payment_method')->nullable();
            $table->string('reference')->nullable();
            $table->string('status')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('amc_payments');
    }
};
