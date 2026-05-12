import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLevelsApi, createLevelApi, updateLevelApi, deleteLevelApi, toggleLevelApi } from '../../api/level';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';

const LevelsPage = () => {
    const [levels, setLevels] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        urutan: 1,
        period_id: '',
        deskripsi: '',
        is_active: true
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        fetchPeriods();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getLevelsApi();
            if (res.success) {
                setLevels(res.data);
            }
        } catch (error) {
            toast.error('Gagal mengambil data level.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPeriods = async () => {
        try {
            const res = await axiosInstance.get('/superadmin/periods');
            if (res.data.success) {
                setPeriods(res.data.data);
            }
        } catch (error) {}
    };

    const handleOpenModal = (level = null) => {
        if (level) {
            setSelectedLevel(level);
            setFormData({
                nama: level.nama,
                urutan: level.urutan,
                period_id: level.period_id,
                deskripsi: level.deskripsi || '',
                is_active: level.is_active
            });
        } else {
            setSelectedLevel(null);
            setFormData({
                nama: '',
                urutan: levels.length + 1,
                period_id: periods.find(p => p.is_active)?.id || '',
                deskripsi: '',
                is_active: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedLevel) {
                await updateLevelApi(selectedLevel.id, formData);
                toast.success('Level berhasil diperbarui');
            } else {
                await createLevelApi(formData);
                toast.success('Level berhasil ditambahkan');
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Terjadi kesalahan.');
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await toggleLevelApi(id);
            toast.success('Status level berhasil diubah');
            fetchData();
        } catch (err) {}
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus level ini? Semua pertanyaan di dalamnya juga akan terpengaruh.')) {
            try {
                await deleteLevelApi(id);
                toast.success('Level berhasil dihapus');
                fetchData();
            } catch (err) {
                toast.error(err.message || 'Gagal menghapus level.');
            }
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Bank Soal & Level</h2>
                    <p className="text-muted">Kelola tingkatan assessment dan butir pertanyaan.</p>
                </div>
                <button className="btn btn-primary shadow-sm" onClick={() => handleOpenModal()}>
                    <i className="bi bi-plus-lg me-2"></i>Tambah Level
                </button>
            </div>

            {loading ? (
                <LoadingSkeleton.Table rows={5} cols={6} />
            ) : levels && levels.length > 0 ? (
                <div className="row">
                    {levels.map((level) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={level.id}>
                            <div className="card border-0 shadow-sm h-100 hover-shadow transition">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className={`badge ${level.is_active ? 'bg-primary' : 'bg-secondary'} rounded-pill px-3`}>
                                            Level {level.urutan}
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
                                                <li><button className="dropdown-item" onClick={() => handleOpenModal(level)}><i className="bi bi-pencil me-2"></i>Edit Level</button></li>
                                                <li><button className="dropdown-item" onClick={() => handleToggleActive(level.id)}><i className={`bi bi-${level.is_active ? 'eye-slash' : 'eye'} me-2`}></i>{level.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item text-danger" onClick={() => handleDelete(level.id)}><i className="bi bi-trash me-2"></i>Hapus</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <h4 className="fw-bold mb-2">{level.nama}</h4>
                                    <p className="text-muted small mb-4 line-clamp-2">{level.deskripsi || 'Tidak ada deskripsi.'}</p>
                                    
                                    <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                                        <div className="me-3">
                                            <i className="bi bi-question-circle-fill text-primary fs-4"></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold h5 mb-0">{level.pertanyaans_count || 0}</div>
                                            <div className="text-muted extra-small uppercase fw-bold ls-1">Pertanyaan</div>
                                        </div>
                                    </div>

                                    <button 
                                        className="btn btn-outline-primary w-100 fw-bold py-2"
                                        onClick={() => navigate(`/superadmin/levels/${level.id}/questions`)}
                                    >
                                        Kelola Pertanyaan <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                                <div className="card-footer bg-white border-0 py-3 px-4 text-center border-top">
                                    <span className="small text-muted">Periode: <span className="fw-bold text-dark">{level.period?.nama || '-'}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState 
                    icon="journal-x"
                    title="Belum ada level"
                    message="Silakan buat level assessment pertama Anda untuk mulai mengisi bank soal."
                    action={{ label: 'Tambah Level', onClick: () => handleOpenModal() }}
                />
            )}

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header border-0 p-4 pb-0">
                                    <h5 className="modal-title fw-bold">
                                        {selectedLevel ? 'Edit Level' : 'Tambah Level Baru'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-muted text-uppercase">Nama Level</label>
                                            <input 
                                                type="text" 
                                                className="form-control border-2" 
                                                placeholder="Contoh: Strata Standar"
                                                value={formData.nama}
                                                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold small text-muted text-uppercase">Urutan</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control border-2" 
                                                    value={formData.urutan}
                                                    onChange={(e) => setFormData({...formData, urutan: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-bold small text-muted text-uppercase">Periode</label>
                                                <select 
                                                    className="form-select border-2"
                                                    value={formData.period_id}
                                                    onChange={(e) => setFormData({...formData, period_id: e.target.value})}
                                                    required
                                                >
                                                    <option value="">Pilih Periode</option>
                                                    {periods.map(p => (
                                                        <option key={p.id} value={p.id}>{p.nama} ({p.tahun})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-muted text-uppercase">Deskripsi</label>
                                            <textarea 
                                                className="form-control border-2" 
                                                rows="3"
                                                placeholder="Berikan penjelasan singkat mengenai level ini..."
                                                value={formData.deskripsi}
                                                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                                            ></textarea>
                                        </div>
                                        <div className="form-check form-switch mt-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="isActiveSwitch"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                            />
                                            <label className="form-check-label fw-medium" htmlFor="isActiveSwitch">
                                                Level ini aktif
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 p-4 pt-0">
                                        <button type="button" className="btn btn-light fw-bold px-4" onClick={() => setShowModal(false)}>Batal</button>
                                        <button type="submit" className="btn btn-primary fw-bold px-4">
                                            {selectedLevel ? 'Simpan Perubahan' : 'Simpan Level'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            <style>{`
                .hover-shadow:hover {
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
                    transform: translateY(-5px);
                }
                .transition {
                    transition: all 0.3s ease;
                }
                .extra-small { font-size: 0.65rem; }
                .ls-1 { letter-spacing: 1px; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default LevelsPage;
