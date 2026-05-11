import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getLevelsApi } from '../../api/assessment';
import { toast } from 'react-toastify';

const SekolahDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await getLevelsApi();
            if (response.success) {
                setLevels(response.data);
            }
        } catch (error) {
            toast.error('Gagal mengambil data dashboard.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate Summary Stats
    const stats = {
        total: levels.length,
        final: levels.filter(l => l.status === 'final').length,
        draft: levels.filter(l => l.status === 'draft').length,
        locked: levels.filter(l => l.status === 'locked' || l.status === 'unlocked' && l.progress === 0).length,
    };

    const overallProgress = levels.length > 0 
        ? Math.round(levels.reduce((acc, curr) => acc + curr.progress, 0) / levels.length) 
        : 0;

    const today = new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    if (loading) {
        return <div className="container mt-4"><div className="spinner-border text-primary"></div></div>;
    }

    return (
        <div className="container mt-2 pb-5">
            {/* Greeting */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm bg-primary text-white p-4 overflow-hidden position-relative">
                        <div className="position-relative z-1">
                            <h2 className="fw-bold mb-1">Selamat datang, {user?.sekolah?.nama || 'Sekolah'}!</h2>
                            <p className="mb-0 opacity-75">{today}</p>
                        </div>
                        <i className="bi bi-mortarboard position-absolute end-0 bottom-0 opacity-25" style={{ fontSize: '10rem', transform: 'translate(20%, 20%)' }}></i>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 p-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <i className="bi bi-layers text-primary fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small">Total Level</h6>
                                <h3 className="fw-bold mb-0">{stats.total}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 p-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <i className="bi bi-check-circle text-success fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small">Sudah Final</h6>
                                <h3 className="fw-bold mb-0">{stats.final}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 p-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <i className="bi bi-pencil-square text-warning fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small">Sedang Diisi</h6>
                                <h3 className="fw-bold mb-0">{stats.draft}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100 p-3">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                                <i className="bi bi-lock text-secondary fs-4"></i>
                            </div>
                            <div>
                                <h6 className="text-muted mb-1 small">Belum Terbuka</h6>
                                <h3 className="fw-bold mb-0">{levels.filter(l => l.status === 'locked').length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Progress & List Level */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 mb-4">
                        <h5 className="fw-bold mb-3">Progres Assessment Keseluruhan</h5>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Selesai {stats.final} dari {stats.total} level</span>
                            <span className="fw-bold text-primary">{overallProgress}%</span>
                        </div>
                        <div className="progress mb-2" style={{ height: '12px' }}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${overallProgress}%` }}></div>
                        </div>
                        <p className="text-muted small mt-2">Selesaikan semua level untuk mendapatkan rekapitulasi skor akhir.</p>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0">Status Per Level</h5>
                            <Link to="/sekolah/assessment" className="btn btn-sm btn-link text-decoration-none">Lihat Semua</Link>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 border-0 small text-muted">NAMA LEVEL</th>
                                            <th className="border-0 small text-muted">PROGRES</th>
                                            <th className="border-0 small text-muted">STATUS</th>
                                            <th className="border-0 small text-muted text-center">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {levels.slice(0, 5).map((level) => (
                                            <tr key={level.id}>
                                                <td className="px-4 fw-medium">{level.nama}</td>
                                                <td>
                                                    <div className="d-flex align-items-center" style={{ width: '100px' }}>
                                                        <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                                                            <div className="progress-bar bg-primary" style={{ width: `${level.progress}%` }}></div>
                                                        </div>
                                                        <span className="extra-small">{level.progress}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {level.status === 'final' && <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3">Final</span>}
                                                    {level.status === 'draft' && <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle px-3">Draft</span>}
                                                    {level.status === 'unlocked' && <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3">Terbuka</span>}
                                                    {level.status === 'locked' && <span className="badge rounded-pill bg-light text-muted border px-3">Terkunci</span>}
                                                </td>
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/sekolah/levels/${level.id}`)}
                                                        disabled={level.status === 'locked'}
                                                    >
                                                        {level.status === 'final' ? 'Lihat' : 'Isi'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Info */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 mb-4">
                        <h5 className="fw-bold mb-3"><i className="bi bi-info-circle me-2 text-primary"></i>Periode Assessment</h5>
                        <div className="p-3 bg-light rounded border-start border-primary border-4 mb-3">
                            <h6 className="fw-bold mb-1">Tahun Ajaran 2024/2025</h6>
                            <p className="text-muted small mb-0">Status: Aktif</p>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small text-muted">Batas Akhir:</span>
                            <span className="small fw-bold">31 Mei 2026</span>
                        </div>
                        <div className="alert alert-warning py-2 small border-0 mb-0">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Batas pengisian tinggal <strong>21 hari</strong> lagi.
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3 px-4">
                            <h5 className="fw-bold m-0">Pengumuman Terbaru</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                <a href="#" className="list-group-item list-group-item-action p-4 border-0">
                                    <div className="d-flex w-100 justify-content-between mb-1">
                                        <h6 className="fw-bold mb-0">Panduan Pengisian Level 3</h6>
                                        <small className="text-muted">Kemarin</small>
                                    </div>
                                    <p className="mb-0 text-muted small">Mohon perhatikan bagian upload bukti fisik pada kriteria kesehatan lingkungan...</p>
                                </a>
                                <a href="#" className="list-group-item list-group-item-action p-4 border-0">
                                    <div className="d-flex w-100 justify-content-between mb-1">
                                        <h6 className="fw-bold mb-0">Jadwal Verifikasi Lapangan</h6>
                                        <small className="text-muted">2 hari lalu</small>
                                    </div>
                                    <p className="mb-0 text-muted small">Verifikasi akan dilakukan mulai bulan Juni setelah semua sekolah melakukan submit final...</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .extra-small { font-size: 0.7rem; }
                .bg-primary-subtle { background-color: #e7f1ff; }
                .bg-success-subtle { background-color: #e6fffa; }
                .bg-warning-subtle { background-color: #fff9e6; }
            `}</style>
        </div>
    );
};

export default SekolahDashboard;
