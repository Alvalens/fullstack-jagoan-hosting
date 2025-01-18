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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id();
            $table->integer('nominal');
            $table->enum('jenis', ['pemasukan', 'pengeluaran']);
            $table->string('keterangan');
            $table->string('deskripsi');
            $table->date('tanggal');
            $table->foreignId('penghuni_id')->constrained()->nullable()->onDelete('cascade');
            $table->foreignId('rumah_id')->constrained()->nullable()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
