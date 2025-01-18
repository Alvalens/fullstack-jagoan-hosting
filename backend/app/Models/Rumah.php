<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rumah extends Model
{
    protected $fillable = [
        'nama',
        'alamat',
        'status_rumah',
    ];

    public function historyPenghuni()
    {
        return $this->hasMany(HistoryPenghuni::class);
    }
}
