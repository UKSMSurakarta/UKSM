import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetailSekolahApi } from '../../api/report';
import { verifyLevelApi } from '../../api/verification';
import { toast } from 'react-toastify';

const DetailVerifikasiPage = () => {
    const { sekolahId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [catatan, setCatatan] = useState({});

    useEffect(() => {
        fetchDetail();
    }, [sekolahId]);

    const fetchDetail = async () => {
        try {
            const res = await getDetailSekolahApi(sekolahId);
            setData(res.data);
        } catch (error) {
            toast.error('Gagal mengambil detail jawaban.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (levelId, status) => {
        if (status === 'ditolak' && !catatan[levelId]) {
            toast.warning('Harap berikan catatan alasan penolakan.');
            return;
        }

        setVerifying(true);
        try {
            await verifyLevelApi(sekolahId, levelId, {
                status,
                catatan: catatan[levelId] || ''
            });
            toast.success(`Level berhasil ${status === 'disetujui' ? 'disetujui' : 'ditolak'}.`);
            fetchDetail(); // Refresh
        } catch (error) {
            toast.error('Gagal memproses verifikasi.');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return <div className="container p-5 text-center"><div className="spinner-border text-primary"></div></div>;
    if (!data) return <div className="container p-5 text-center"><h5>Data tidak ditemukan.</h5></div>;

    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-light rounded-circle me-3 border" onClick={() => navigate('/admin/verifikasi')}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                    <h4 className="fw-bold m-0">{data.sekolah?.nama || 'Nama Sekolah'}</h4>
                    <p className="text-muted small mb-0">{data.sekolah?.jenjang} - {data.sekolah?.opd?.nama}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    {data.assessment && data.assessment.map(level => (
                        <div key={level.id} className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold m-0 text-primary">Level {level.nama}</h5>
                                <div>
                                    {level.status === 'verified' ? (
                                        <span className="badge bg-success rounded-pill px-3 py-2"><i className="bi bi-patch-check-fill me-1"></i> Terverifikasi</span>
                                    ) : level.status === 'final' ? (
                                        <span className="badge bg-warning text-dark rounded-pill px-3 py-2"><i className="bi bi-clock-fill me-1"></i> Menunggu Verifikasi</span>
                                    ) : (
                                        <span className="badge bg-secondary rounded-pill px-3 py-2 text-capitalize">{level.status.replace('_', ' ')}</span>
                                    )}
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered align-middle">
                                        <thead className="table-light small text-uppercase">
                                            <tr>
                                                <th style={{ width: '45%' }}>Pertanyaan</th>
                                                <th>Jawaban</th>
                                                <th className="text-center" style={{ width: '100px' }}>Skor</th>
                                                <th className="text-center" style={{ width: '120px' }}>Bukti Fisik</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {level.jawabans && level.jawabans.map((j, idx) => (
                                                <tr key={idx}>
                                                    <td className="small">{j.pertanyaan}</td>
                                                    <td className="fw-medium">{j.jawaban || <span className="text-muted italic">Tidak diisi</span>}</td>
                                                    <td className="text-center fw-bold text-primary">{j.nilai}</td>
                                                    <td className="text-center">
                                                        {j.bukti ? (
                                                            <a href={j.bukti} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info rounded-pill px-3">
                                                                <i className="bi bi-file-earmark-text"></i> Lihat
                                                            </a>
                                                        ) : <span className="text-muted small">-</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-light">
                                            <tr>
                                                <td colSpan="2" className="text-end fw-bold">TOTAL SKOR LEVEL</td>
                                                <td className="text-center fw-bold text-success fs-5">{level.total_skor}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {level.status === 'final' && (
                                    <div className="mt-4 p-4 bg-light rounded-4 border-start border-warning border-4">
                                        <h6 className="fw-bold mb-3">Tindakan Verifikasi</h6>
                                        <div className="mb-3">
                                            <textarea 
                                                className="form-control border-2" 
                                                rows="2" 
                                                placeholder="Berikan catatan jika ditolak (wajib) atau catatan tambahan jika disetujui..."
                                                value={catatan[level.id] || ''}
                                                onChange={(e) => setCatatan({...catatan, [level.id]: e.target.value})}
                                            ></textarea>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-success px-4 fw-bold shadow-sm" 
                                                onClick={() => handleVerify(level.id, 'disetujui')}
                                                disabled={verifying}
                                            >
                                                Setujui Level
                                            </button>
                                            <button 
                                                className="btn btn-danger px-4 fw-bold shadow-sm" 
                                                onClick={() => handleVerify(level.id, 'ditolak')}
                                                disabled={verifying}
                                            >
                                                Tolak & Minta Perbaikan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailVerifikasiPage;
