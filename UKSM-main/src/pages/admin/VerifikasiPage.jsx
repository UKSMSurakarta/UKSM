import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVerifikasiListApi } from '../../api/verification';
import { toast } from 'react-toastify';

const VerifikasiPage = () => {
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [jenjangFilter, setJenjangFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        let result = list;
        if (searchTerm) {
            result = result.filter(s => s.nama.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (jenjangFilter) {
            result = result.filter(s => s.jenjang === jenjangFilter);
        }
        setFilteredList(result);
    }, [searchTerm, jenjangFilter, list]);

    const fetchList = async () => {
        try {
            const res = await getVerifikasiListApi();
            setList(res.data);
            setFilteredList(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data verifikasi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="mb-4 d-flex justify-content-between align-items-end flex-wrap gap-3">
                <div>
                    <h4 className="fw-bold m-0">Verifikasi Assessment</h4>
                    <p className="text-muted small mb-0">Daftar sekolah yang telah melakukan submit final dan menunggu validasi.</p>
                </div>
                <div className="d-flex gap-2">
                    <input 
                        type="text" 
                        className="form-control form-control-sm shadow-sm" 
                        placeholder="Cari sekolah..." 
                        style={{ width: '200px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        className="form-select form-select-sm shadow-sm" 
                        style={{ width: '130px' }}
                        value={jenjangFilter}
                        onChange={(e) => setJenjangFilter(e.target.value)}
                    >
                        <option value="">Semua Jenjang</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA</option>
                        <option value="SMK">SMK</option>
                    </select>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 small fw-bold text-uppercase">Sekolah</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase">NPSN</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase">Jenjang</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase">Level Menunggu</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                            ) : filteredList.length > 0 ? (
                                filteredList.map((sekolah) => (
                                    <tr key={sekolah.id}>
                                        <td className="px-4 py-3 fw-bold text-dark">{sekolah.nama}</td>
                                        <td>{sekolah.npsn}</td>
                                        <td><span className="badge bg-info-subtle text-info border border-info-subtle px-3">{sekolah.jenjang}</span></td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                {sekolah.levelSubmissions.map(sub => (
                                                    <span key={sub.id} className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3 py-2">
                                                        <i className="bi bi-clock-history me-1"></i> Level {sub.level.urutan}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <button 
                                                className="btn btn-sm btn-primary rounded-pill px-4"
                                                onClick={() => navigate(`/admin/verifikasi/${sekolah.id}`)}
                                            >
                                                Periksa Jawaban
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">Tidak ada pengajuan verifikasi baru.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
