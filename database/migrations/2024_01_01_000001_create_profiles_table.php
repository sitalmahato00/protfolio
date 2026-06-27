<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Sital Mahato');
            $table->string('title')->default('Full Stack Developer');
            $table->text('bio')->nullable();
            $table->string('email')->default('sitalmahato077@gmail.com');
            $table->string('phone')->default('+977 9704191610');
            $table->string('location')->default('Golbazar, Siraha, Nepal');
            $table->string('avatar')->nullable();
            $table->string('resume')->nullable();
            $table->string('github')->default('https://github.com/sitalmahato00');
            $table->string('linkedin')->default('https://linkedin.com/in/sitalmahato');
            $table->string('availability')->default('Available for Work');
            $table->json('typewriter_words')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('profiles'); }
};
