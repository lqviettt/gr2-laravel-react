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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->string('vnp_TxnRef', 100)->unique()->index();
            $table->decimal('vnp_Amount', 15, 2);
            $table->string('vnp_BankCode', 20)->nullable();
            $table->string('vnp_IpAddr', 45)->nullable();
            $table->string('vnp_CreateDate')->nullable();
            $table->string('vnp_ExpireDate')->nullable();
            $table->string('vnp_Locale', 10)->default('vn');
            $table->enum('payment_status', ['pending', 'success', 'failed', 'cancelled'])->default('pending')->index();
            $table->string('vnp_TransactionNo', 100)->nullable();
            $table->string('vnp_CardType', 50)->nullable();
            $table->text('vnp_OrderInfo')->nullable();
            $table->string('vnp_ResponseCode', 10)->nullable();
            $table->string('vnp_TransactionStatus', 10)->nullable();
            $table->timestamps();

            // Foreign key
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('set null');

            // Indexes
            $table->index(['order_id', 'payment_status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
