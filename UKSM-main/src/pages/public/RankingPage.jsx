import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiBase}/public/ranking-sekolah`);
                setRanking(response.data.data);
            } catch (error) {
                console.error('Error fetching ranking', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, []);

    return (
        <div className="bg-light py-5 min-vh-100">
            <div className="container mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb small">
                        <li className="breadcrumb-item"><Link to="/">Beranda</Link></li>
                        <li className="breadcrumb-item active">Ranking Sekolah</li>
                    </ol>
                </nav>
                <h2 className="fw-bold m-0">Ranking Sekolah Sehat</h2>
                <p className="text-muted">Daftar 10 sekolah dengan skor assessment tertinggi se-Kabupaten.</p>
            </div>

            <div className="container">
                <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-primary text-white">
                                    <tr>
                                        <th className="px-4 py-3 border-0 text-center" style={{ width: '80px' }}>PERINGKAT</th>
                                        <th className="py-3 border-0">NAMA SEKOLAH</th>
                                        <th className="py-3 border-0">JENJANG</th>
                                        <th className="py-3 border-0 text-end px-4">TOTAL SKOR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="spinner-border text-primary spinner-border-sm me-2"></div>
                                                Memuat data peringkat...
                                            </td>
                                        </tr>
                                    ) : ranking.length > 0 ? (
                                        ranking.map((item, index) => (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    {index === 0 ? <i className="bi bi-trophy-fill text-warning fs-4"></i> : 
                                                     index === 1 ? <i className="bi bi-trophy-fill text-secondary fs-5"></i> :
                                                     index === 2 ? <i className="bi bi-trophy-fill text-danger-emphasis fs-5"></i> :
                                                     <span className="fw-bold text-muted">{index + 1}</span>}
                                                </td>
                                                <td>
                                                    <div className="fw-bold">{item.nama}</div>
                                                    <div className="text-muted extra-small">Provinsi Jawa Timur</div>
                                                </td>
                                                <td><span className="badge bg-light text-dark border">{item.jenjang}</span></td>
                                                <td className="text-end px-4">
                                                    <span className="fw-bold text-primary fs-5">{Number(item.total_skor).toLocaleString('id-ID')}</span>
                                                    <small className="text-muted ms-1">Poin</small>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted small">Belum ada data penilaian yang difinalisasi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border-start border-primary border-4">
                    <h6 className="fw-bold"><i className="bi bi-info-circle me-2 text-primary"></i>Informasi Penilaian</h6>
                    <p className="text-muted small mb-0">Peringkat ini dihitung secara otomatis berdasarkan akumulasi bobot nilai dari setiap level assessment yang telah diverifikasi dan difinalisasi oleh pihak sekolah dan dinas terkait. Data diperbarui secara real-time setiap kali ada perubahan status assessment.</p>
                </div>
            </div>
        </div>
    );
};

export default RankingPage;
