<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LevelSubmission extends Model
{
    protected $fillable = [
        'sekolah_id', 'level_id', 'period_id', 
        'status', 'submitted_at', 'finalized_at', 'total_skor'
    ];

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }

    public function sekolah()
    {
        return $this->belongsTo(Sekolah::class, 'sekolah_id');
    }
}
