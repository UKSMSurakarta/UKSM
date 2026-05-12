import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVerifikasiListApi } from '../../api/verification';
import { toast } from 'react-toastify';

const VerifikasiPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = async () => {
        try {
            const res = await getVerifikasiListApi();
            setList(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data verifikasi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h4 className="fw-bold m-0">Verifikasi Assessment</h4>
                <p className="text-muted small">Daftar sekolah yang telah melakukan submit final dan menunggu validasi.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr className="bg-light border-bottom">
                                    <th className="px-4 py-3 border-0 text-muted small fw-bold text-uppercase ls-1">Informasi Sekolah</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase ls-1">Wilayah / OPD</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase ls-1">Level Menunggu</th>
                                    <th className="py-3 border-0 text-muted small fw-bold text-uppercase ls-1 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="spinner-border text-primary me-2"></div>
                                            <div className="mt-2 text-muted">Menyiapkan data verifikasi...</div>
                                        </td>
                                    </tr>
                                ) : list.length > 0 ? (
                                    list.map(sekolah => (
                                        <tr key={sekolah.id} className="transition-all">
                                            <td className="px-4 py-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary-subtle text-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                                        <i className="bi bi-building fs-4"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark fs-6">{sekolah.nama}</div>
                                                        <div className="badge bg-light text-primary border border-primary-subtle extra-small mt-1">{sekolah.jenjang}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="fw-medium text-secondary">{sekolah.opd?.nama || '-'}</div>
                                                <div className="extra-small text-muted mt-1"><i className="bi bi-geo-alt me-1"></i>Kota Surakarta</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="d-flex flex-wrap gap-1">
                                                    {sekolah.levelSubmissions.map(sub => (
                                                        <span key={sub.id} className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3 py-2">
                                                            <i className="bi bi-clock-history me-1"></i> Level {sub.level.urutan}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-center py-4 px-4">
                                                <button 
                                                    className="btn btn-primary rounded-3 px-4 py-2 fw-bold shadow-sm"
                                                    onClick={() => navigate(`/admin/verifikasi/${sekolah.id}`)}
                                                >
                                                    Periksa Jawaban <i className="bi bi-arrow-right ms-1"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="mb-3 text-muted">
                                                <i className="bi bi-check-all fs-1 opacity-25"></i>
                                            </div>
                                            <h6 className="fw-bold text-dark">Semua Beres!</h6>
                                            <p className="text-muted small mb-0">Tidak ada sekolah yang menunggu verifikasi saat ini.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <style>{`
                .extra-small { font-size: 0.7rem; }
                .ls-1 { letter-spacing: 0.5px; }
                .bg-primary-subtle { background-color: #e7f1ff; }
                .bg-warning-subtle { background-color: #fff9e6; }
                .transition-all { transition: all 0.2s ease; }
                .transition-all:hover { background-color: #fcfdfe; }
            `}</style>
        </div>
    );
};

export default VerifikasiPage;
