<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penghuni extends Model
{
    protected $fillable = [
        'nama',
        'ktp',
        'no_hp',
        'status_penghuni',
        'status_pernikahan',
    ];

    public function historyPenghuni()
    {
        return $this->hasMany(HistoryPenghuni::class);
    }
}
