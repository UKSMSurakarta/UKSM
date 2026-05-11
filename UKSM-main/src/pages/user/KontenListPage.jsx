import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getKontensApi, deleteKontenApi, togglePublishApi } from '../../api/content';
import { toast } from 'react-toastify';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';

const KontenListPage = () => {
    const [tipe, setTipe] = useState('berita');
    const [kontens, setKontens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchKontens();
    }, [tipe, page]);

    const fetchKontens = async () => {
        setLoading(true);
        try {
            const res = await getKontensApi(tipe, page);
            setKontens(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error('Gagal mengambil data konten.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteKontenApi(selectedId);
            toast.success('Konten berhasil dihapus.');
            fetchKontens();
        } catch (error) {
            toast.error('Gagal menghapus konten.');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            const res = await togglePublishApi(id);
            toast.success(res.message);
            fetchKontens();
        } catch (error) {
            toast.error('Gagal mengubah status publikasi.');
        }
    };

    const tabs = [
        { key: 'berita', label: 'Berita', icon: 'newspaper' },
        { key: 'pengumuman', label: 'Pengumuman', icon: 'megaphone' },
        { key: 'agenda', label: 'Agenda', icon: 'calendar-event' },
        { key: 'galeri', label: 'Galeri', icon: 'images' },
    ];

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Manajemen Konten</h4>
                <Link to={`/user/kontens/create?type=${tipe}`} className="btn btn-primary shadow-sm rounded-pill px-4">
                    <i className="bi bi-plus-lg me-2"></i> Tambah {tipe.charAt(0).toUpperCase() + tipe.slice(1)}
                </Link>
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills bg-white p-2 rounded-pill shadow-sm mb-4 d-inline-flex border">
                {tabs.map(tab => (
                    <li className="nav-item" key={tab.key}>
                        <button 
                            className={`nav-link rounded-pill px-4 fw-medium ${tipe === tab.key ? 'active' : 'text-dark'}`}
                            onClick={() => { setTipe(tab.key); setPage(1); }}
                        >
                            <i className={`bi bi-${tab.icon} me-2`}></i> {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="small text-muted">
                                    <th className="px-4 py-3 border-0">INFO KONTEN</th>
                                    <th className="py-3 border-0">TANGGAL</th>
                                    <th className="py-3 border-0">STATUS</th>
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
                                ) : kontens.length > 0 ? (
                                    kontens.map(item => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <img 
                                                        src={item.thumbnail_url || 'https://via.placeholder.com/80x50'} 
                                                        alt="" 
                                                        className="rounded me-3 object-fit-cover" 
                                                        style={{ width: '60px', height: '40px' }} 
                                                    />
                                                    <div>
                                                        <div className="fw-bold">{item.judul}</div>
                                                        <div className="text-muted extra-small">Oleh: {item.author.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="small">{item.created_at}</td>
                                            <td>
                                                <StatusBadge published={item.is_published} />
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-light border me-1" onClick={() => handleTogglePublish(item.id)} title={item.is_published ? 'Unpublish' : 'Publish'}>
                                                        <i className={`bi bi-${item.is_published ? 'eye-slash' : 'eye'} text-primary`}></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-light border me-1" onClick={() => navigate(`/user/kontens/edit/${item.id}`)} title="Edit">
                                                        <i className="bi bi-pencil-square text-dark"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-light border text-danger" 
                                                        onClick={() => { setSelectedId(item.id); setShowDeleteModal(true); }}
                                                        title="Hapus"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">Belum ada konten untuk tipe ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmModal 
                show={showDeleteModal}
                title="Hapus Konten?"
                message="Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-success-subtle { background-color: #e6fffa; }
                .bg-warning-subtle { background-color: #fff9e6; }
                .object-fit-cover { object-fit: cover; }
            `}</style>
        </div>
    );
};

export default KontenListPage;
