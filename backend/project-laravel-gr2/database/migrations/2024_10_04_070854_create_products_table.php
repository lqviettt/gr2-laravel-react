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
        Schema::create('products', function (Blueprint $table) {
            $table->id('id');
            $table->string('name', 32);
            $table->string('code', 20)->unique();
            $table->smallInteger('quantity')->default(0);
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('description', 255)->nullable();
            $table->integer('price')->unsigned(); 
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

