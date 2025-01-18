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

    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class);
    }

    public function rumah()
    {
        return $this->belongsTo(Rumah::class);
    }
}
