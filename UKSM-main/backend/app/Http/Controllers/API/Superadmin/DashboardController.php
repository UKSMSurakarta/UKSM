<?php

namespace App\Http\Controllers\API\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use App\Models\Opd;
use App\Models\AssessmentPeriod;
use App\Models\LevelSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSekolah = Sekolah::count();
        $totalOpd = Opd::count();
        $activePeriod = AssessmentPeriod::where('is_active', true)->first();
        
        $sekolahSudahMengisi = LevelSubmission::distinct('sekolah_id')->count();
        $persentaseMengisi = $totalSekolah > 0 ? round(($sekolahSudahMengisi / $totalSekolah) * 100) : 0;

        // Stats by Status
        $statsByStatus = [
            ['name' => 'Belum Mulai', 'value' => $totalSekolah - $sekolahSudahMengisi],
            ['name' => 'Sedang Mengisi', 'value' => LevelSubmission::where('status', 'draft')->distinct('sekolah_id')->count()],
            ['name' => 'Selesai', 'value' => LevelSubmission::where('status', 'final')->distinct('sekolah_id')->count()],
        ];

        // Stats by Jenjang
        $statsByJenjang = Sekolah::select('jenjang', DB::raw('count(*) as value'))
            ->groupBy('jenjang')
            ->get()
            ->map(function ($item) {
                return ['name' => $item->jenjang, 'value' => $item->value];
            });

        return response()->json([
            'success' => true,
            'message' => 'Statistik dashboard superadmin berhasil diambil.',
            'data' => [
                'summary' => [
                    'total_sekolah' => $totalSekolah,
                    'total_opd' => $totalOpd,
                    'active_period' => $activePeriod ? $activePeriod->nama : 'Tidak ada',
                    'persentase_mengisi' => $persentaseMengisi,
                ],
                'chart_status' => $statsByStatus,
                'chart_jenjang' => $statsByJenjang,
            ]
        ]);
    }

    public function monitoring(Request $request)
    {
        $query = Sekolah::with(['opd', 'submissions']);

        if ($request->opd_id) $query->where('opd_id', $request->opd_id);
        if ($request->jenjang) $query->where('jenjang', $request->jenjang);

        $sekolahs = $query->get()->map(function ($s) {
            $lastSubmission = $s->submissions()->latest()->first();
            return [
                'id' => $s->id,
                'nama' => $s->nama,
                'jenjang' => $s->jenjang,
                'opd' => $s->opd ? $s->opd->nama : '-',
                'status' => $lastSubmission ? $lastSubmission->status : 'Belum Mulai',
                'progress' => $lastSubmission ? 100 : 0, // Simplified for now
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $sekolahs
        ]);
    }
}
