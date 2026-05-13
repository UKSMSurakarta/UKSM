import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const DataSekolahPage = () => {
    const [sekolahs, setSekolahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [jenjang, setJenjang] = useState('');
    const [pagination, setPagination] = useState({});

    const fetchSekolahs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/admin/sekolahs?page=${page}&search=${search}&jenjang=${jenjang}`);
            setSekolahs(response.data.data.data);
            setPagination(response.data.data);
        } catch (error) {
            toast.error('Gagal mengambil data sekolah');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSekolahs();
    }, [jenjang]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSekolahs(1);
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold m-0">Data Sekolah Binaan</h4>
                    <p className="text-muted small">Kelola dan lihat informasi sekolah di wilayah Anda.</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <form className="row g-3" onSubmit={handleSearch}>
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Cari nama atau NPSN..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select" 
                                value={jenjang}
                                onChange={(e) => setJenjang(e.target.value)}
                            >
                                <option value="">Semua Jenjang</option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="SMK">SMK</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Filter</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                {loading ? (
                    <div className="p-4">
                        <TableSkeleton rows={8} cols={6} />
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3 border-0 small fw-bold text-uppercase">Sekolah</th>
                                        <th className="py-3 border-0 small fw-bold text-uppercase">NPSN</th>
                                        <th className="py-3 border-0 small fw-bold text-uppercase">Jenjang</th>
                                        <th className="py-3 border-0 small fw-bold text-uppercase">Kepala Sekolah</th>
                                        <th className="py-3 border-0 small fw-bold text-uppercase">Status</th>
                                        <th className="py-3 border-0 small fw-bold text-uppercase text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sekolahs.length > 0 ? (
                                        sekolahs.map((s) => (
                                            <tr key={s.id}>
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">{s.nama}</div>
                                                    <div className="text-muted extra-small">{s.alamat}</div>
                                                </td>
                                                <td>{s.npsn}</td>
                                                <td><span className="badge bg-info-subtle text-info border border-info-subtle px-3">{s.jenjang}</span></td>
                                                <td>{s.kepala_sekolah || '-'}</td>
                                                <td>
                                                    {s.is_active ? (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2">Aktif</span>
                                                    ) : (
                                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2">Nonaktif</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-light border" title="Lihat Detail">
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">Tidak ada data ditemukan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {pagination.total > pagination.per_page && (
                            <div className="card-footer bg-white border-0 py-3">
                                <nav>
                                    <ul className="pagination pagination-sm justify-content-center mb-0">
                                        {pagination.links.map((link, idx) => (
                                            <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => link.url && fetchSekolahs(link.url.split('page=')[1])}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-info-subtle { background-color: #e0f7fa; }
                .bg-success-subtle { background-color: #e8f5e9; }
                .bg-danger-subtle { background-color: #ffebee; }
            `}</style>
        </div>
    );
};

export default DataSekolahPage;
