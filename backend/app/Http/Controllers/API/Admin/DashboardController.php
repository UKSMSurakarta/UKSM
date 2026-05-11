<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use App\Models\LevelSubmission;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $opdId = auth()->user()->opd_id;
        $totalSekolah = Sekolah::where('opd_id', $opdId)->count();
        $sekolahSudahMengisi = LevelSubmission::whereIn('sekolah_id', Sekolah::where('opd_id', $opdId)->pluck('id'))
            ->distinct('sekolah_id')
            ->count();

        $recentSubmissions = LevelSubmission::with('sekolah')
            ->whereIn('sekolah_id', Sekolah::where('opd_id', $opdId)->pluck('id'))
            ->where('status', 'final')
            ->whereDate('submitted_at', now())
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Statistik dashboard admin berhasil diambil.',
            'data' => [
                'summary' => [
                    'total_sekolah' => $totalSekolah,
                    'sekolah_aktif' => $sekolahSudahMengisi,
                    'belum_mengisi' => $totalSekolah - $sekolahSudahMengisi,
                ],
                'recent_notifications' => $recentSubmissions->map(function ($s) {
                    return [
                        'message' => "Sekolah {$s->sekolah->nama} baru saja melakukan submit final.",
                        'time' => $s->submitted_at->diffForHumans()
                    ];
                })
            ]
        ]);
    }
}
