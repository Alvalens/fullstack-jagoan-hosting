<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoryPenghuni extends Model
{
    protected $fillable = [
        'penghuni_id',
        'rumah_id',
        'tanggal_masuk',
        'tanggal_keluar',
    ];
}
