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

            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="small text-muted">
                                    <th className="px-4 py-3 border-0">NAMA SEKOLAH</th>
                                    <th className="py-3 border-0">JENJANG</th>
                                    <th className="py-3 border-0">LEVEL MENUNGGU</th>
                                    <th className="py-3 border-0 text-center">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : list.length > 0 ? (
                                    list.map(sekolah => (
                                        <tr key={sekolah.id}>
                                            <td className="px-4">
                                                <div className="fw-bold">{sekolah.nama}</div>
                                                <div className="text-muted extra-small">{sekolah.opd?.nama}</div>
                                            </td>
                                            <td><span className="badge bg-light text-dark border">{sekolah.jenjang}</span></td>
                                            <td>
                                                {sekolah.submissions.map(sub => (
                                                    <span key={sub.id} className="badge bg-warning-subtle text-warning me-1 mb-1">
                                                        Level {sub.level.urutan}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    className="btn btn-sm btn-primary rounded-pill px-3"
                                                    onClick={() => navigate(`/admin/verifikasi/${sekolah.id}`)}
                                                >
                                                    <i className="bi bi-shield-check me-1"></i> Periksa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">Tidak ada data yang menunggu verifikasi.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-warning-subtle { background-color: #fff9e6; border: 1px solid #ffeeba; }
            `}</style>
        </div>
    );
};

export default VerifikasiPage;
