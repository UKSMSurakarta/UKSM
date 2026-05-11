<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ExampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. OPD
        $opdId = DB::table('opds')->insertGetId([
            'nama' => 'Dinas Pendidikan',
            'kode' => 'DISDIK-001',
            'alamat' => 'Jl. Pendidikan No. 123',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Sekolah
        $sekolahId = DB::table('sekolahs')->insertGetId([
            'nama' => 'SD Negeri 01 Contoh',
            'npsn' => '12345678',
            'jenjang' => 'SD',
            'alamat' => 'Jl. Merdeka No. 10',
            'kepala_sekolah' => 'Budi Santoso, M.Pd',
            'opd_id' => $opdId,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Assessment Period
        $periodId = DB::table('assessment_periods')->insertGetId([
            'nama' => 'Tahun Ajaran 2024/2025',
            'tahun' => 2024,
            'tanggal_mulai' => '2024-07-01',
            'tanggal_selesai' => '2025-06-30',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Levels
        $level1Id = DB::table('levels')->insertGetId([
            'nama' => 'Level 1: Persiapan Dasar',
            'urutan' => 1,
            'deskripsi' => 'Fokus pada sarana dan prasarana dasar UKS',
            'period_id' => $periodId,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $level2Id = DB::table('levels')->insertGetId([
            'nama' => 'Level 2: Implementasi Program',
            'urutan' => 2,
            'deskripsi' => 'Fokus pada pelaksanaan program kesehatan di sekolah',
            'period_id' => $periodId,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Questions
        $q1Id = DB::table('pertanyaans')->insertGetId([
            'level_id' => $level1Id,
            'teks_pertanyaan' => 'Apakah sekolah memiliki ruang UKS yang memadai?',
            'tipe_jawaban' => 'ya_tidak',
            'bobot' => 10,
            'urutan' => 1,
            'is_required' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $q2Id = DB::table('pertanyaans')->insertGetId([
            'level_id' => $level1Id,
            'teks_pertanyaan' => 'Pilihlah fasilitas yang tersedia di ruang UKS Anda:',
            'tipe_jawaban' => 'pilihan_ganda',
            'bobot' => 20,
            'urutan' => 2,
            'is_required' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('pilihan_jawabans')->insert([
            ['pertanyaan_id' => $q2Id, 'teks' => 'Lengkap (Tempat tidur, lemari obat, timbangan, tensimeter)', 'nilai' => 100, 'created_at' => now(), 'updated_at' => now()],
            ['pertanyaan_id' => $q2Id, 'teks' => 'Cukup (Tempat tidur, lemari obat)', 'nilai' => 50, 'created_at' => now(), 'updated_at' => now()],
            ['pertanyaan_id' => $q2Id, 'teks' => 'Kurang (Hanya tempat tidur)', 'nilai' => 20, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 6. Users
        DB::table('users')->insert([
            [
                'name' => 'Admin Disdik',
                'email' => 'admin@uks.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'opd_id' => $opdId,
                'sekolah_id' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Operator SD 01',
                'email' => 'sekolah@uks.com',
                'password' => Hash::make('password'),
                'role' => 'sekolah',
                'opd_id' => null,
                'sekolah_id' => $sekolahId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Konten Kreator',
                'email' => 'user@uks.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'opd_id' => null,
                'sekolah_id' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
