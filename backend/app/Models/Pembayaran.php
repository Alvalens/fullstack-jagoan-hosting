<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $fillable = [
        'nominal',
        'jenis',
        'keterangan',
        'deskripsi',
        'tanggal',
        'penghuni_id',
        'rumah_id',
    ];
}
