<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sekolah;
use App\Models\Level;
use App\Models\LevelSubmission;
use App\Models\Jawaban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Notifications\LevelVerifiedNotification;
use Illuminate\Support\Facades\Notification;

class VerificationController extends Controller
{
    /**
     * List schools with levels awaiting verification.
     */
    public function index()
    {
        $sekolahs = Sekolah::whereHas('submissions', function($q) {
            $q->where('status', 'final');
        })->with(['opd', 'submissions' => function($q) {
            $q->where('status', 'final')->with('level');
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $sekolahs
        ]);
    }

    /**
     * Verify a specific level for a school.
     */
    public function verify(Request $request, $sekolahId, $levelId)
    {
        $request->validate([
            'status' => 'required|in:disetujui,ditolak',
            'catatan' => 'nullable|string'
        ]);

        $submission = LevelSubmission::where('sekolah_id', $sekolahId)
            ->where('level_id', $levelId)
            ->firstOrFail();

        DB::transaction(function () use ($request, $submission, $sekolahId, $levelId) {
            if ($request->status === 'disetujui') {
                $submission->update([
                    'status' => 'verified',
                    'verified_at' => now(),
                    'verifier_id' => auth()->id(),
                    'catatan_verifikator' => $request->catatan
                ]);
            } else {
                // Reject: Return to draft so school can edit
                $submission->update([
                    'status' => 'draft',
                    'catatan_verifikator' => $request->catatan,
                    'submitted_at' => null // reset submission time
                ]);

                // Also unlock the answers
                Jawaban::where('sekolah_id', $sekolahId)
                    ->whereIn('pertanyaan_id', Level::find($levelId)->pertanyaans()->pluck('id'))
                    ->update(['is_final' => false]);
            }

            // Notify School
            $sekolahUser = \App\Models\User::where('sekolah_id', $sekolahId)->first();
            if ($sekolahUser) {
                $level = Level::find($levelId);
                $sekolahUser->notify(new \App\Notifications\LevelVerifiedNotification([
                    'level_name' => $level->nama,
                    'status' => $request->status,
                    'catatan' => $request->catatan,
                    'level_id' => $levelId
                ]));
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil disimpan.'
        ]);
    }
}
