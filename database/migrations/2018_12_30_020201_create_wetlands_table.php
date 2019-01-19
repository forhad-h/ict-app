<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWetlandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wetlands', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nature')->nullable();
            $table->string('name')->nullable();
            $table->string('location')->nullable();
            $table->string('area')->nullable();
            $table->string('flora')->nullable();
            $table->string('fauna')->nullable();
            $table->string('remarks')->nullable();
            $table->string('pic_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wetlands');
    }
}
