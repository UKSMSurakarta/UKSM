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

    public function monitoring()
    {
        $opdId = auth()->user()->opd_id;
        $activePeriodId = \App\Models\AssessmentPeriod::where('is_active', true)->value('id');
        $totalLevels = \App\Models\Level::where('period_id', $activePeriodId)->count();

        $sekolahs = Sekolah::where('opd_id', $opdId)
            ->withCount([
                'levelSubmissions as draft_count' => function ($q) use ($activePeriodId) {
                    $q->where('period_id', $activePeriodId)->where('status', 'draft');
                },
                'levelSubmissions as final_count' => function ($q) use ($activePeriodId) {
                    $q->where('period_id', $activePeriodId)->where('status', 'final');
                },
                'levelSubmissions as verified_count' => function ($q) use ($activePeriodId) {
                    $q->where('period_id', $activePeriodId)->where('status', 'verified');
                }
            ])
            ->get()
            ->map(function ($s) use ($totalLevels, $activePeriodId) {
                $completed = $s->final_count + $s->verified_count;
                $submissions = \App\Models\LevelSubmission::where('sekolah_id', $s->id)
                    ->where('period_id', $activePeriodId);
                
                $totalSkor = $submissions->where('status', 'verified')->sum('total_skor');
                $lastSubmit = $submissions->max('submitted_at');
                
                return [
                    'id' => $s->id,
                    'nama' => $s->nama,
                    'jenjang' => $s->jenjang,
                    'npsn' => $s->npsn,
                    'kepala_sekolah' => $s->kepala_sekolah,
                    'telepon' => $s->telepon,
                    'progress_percent' => $totalLevels > 0 ? round(($completed / $totalLevels) * 100) : 0,
                    'total_skor' => (int)$totalSkor,
                    'status_counts' => [
                        'draft' => (int)$s->draft_count,
                        'final' => (int)$s->final_count,
                        'verified' => (int)$s->verified_count,
                    ],
                    'last_submit' => $lastSubmit
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $sekolahs
        ]);
    }
}
