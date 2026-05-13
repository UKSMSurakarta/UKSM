import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const PeriodsPage = () => {
    const { data: periods, loading, error, refetch } = useFetch('/superadmin/periods');
    const [showModal, setShowModal] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        tahun: new Date().getFullYear(),
        tanggal_mulai: '',
        tanggal_selesai: '',
        is_active: false
    });

    const handleOpenModal = (period = null) => {
        if (period) {
            setSelectedPeriod(period);
            setFormData({
                nama: period.nama,
                tahun: period.tahun,
                tanggal_mulai: period.tanggal_mulai.split('T')[0],
                tanggal_selesai: period.tanggal_selesai.split('T')[0],
                is_active: period.is_active
            });
        } else {
            setSelectedPeriod(null);
            setFormData({
                nama: '',
                tahun: new Date().getFullYear(),
                tanggal_mulai: '',
                tanggal_selesai: '',
                is_active: false
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedPeriod) {
                await axiosInstance.put(`/superadmin/periods/${selectedPeriod.id}`, formData);
                toast.success('Periode berhasil diperbarui');
            } else {
                await axiosInstance.post('/superadmin/periods', formData);
                toast.success('Periode berhasil ditambahkan');
            }
            setShowModal(false);
            refetch();
        } catch (err) {
            if (err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                const firstError = Object.values(validationErrors)[0][0];
                toast.error(firstError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await axiosInstance.patch(`/superadmin/periods/${id}/toggle-active`);
            toast.success('Status periode berhasil diubah');
            refetch();
        } catch (err) {}
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus periode ini?')) {
            try {
                await axiosInstance.delete(`/superadmin/periods/${id}`);
                toast.success('Periode berhasil dihapus');
                refetch();
            } catch (err) {}
        }
    };

    if (error) return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <div className="bg-danger-subtle text-danger rounded-circle p-4 d-inline-block mb-3">
                    <i className="bi bi-exclamation-triangle fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark">{error}</h4>
                <p className="text-muted mb-4">Pastikan server backend sudah berjalan dan Anda terhubung ke jaringan.</p>
                <button className="btn btn-primary px-4 py-2 rounded-pill shadow-sm" onClick={() => refetch()}>
                    <i className="bi bi-arrow-clockwise me-2"></i>Coba Lagi
                </button>
            </div>
        </div>
    );

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold m-0 text-dark">Periode Assessment</h4>
                    <p className="text-muted small">Kelola jadwal periode pengisian instrumen UKS secara sistematis.</p>
                </div>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleOpenModal()}>
                    <i className="bi bi-plus-lg me-2"></i>Tambah Periode
                </button>
            </div>

            {loading && !periods ? (
                <LoadingSkeleton.Table rows={5} cols={6} />
            ) : periods && periods.length > 0 ? (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3 border-0 small fw-bold text-uppercase">Nama Periode</th>
                                    <th className="py-3 border-0 small fw-bold text-uppercase">Tahun</th>
                                    <th className="py-3 border-0 small fw-bold text-uppercase">Masa Aktif</th>
                                    <th className="py-3 border-0 small fw-bold text-uppercase">Status</th>
                                    <th className="text-end px-4 py-3 border-0 small fw-bold text-uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((period) => (
                                    <tr key={period.id}>
                                        <td className="px-4">
                                            <div className="fw-bold text-dark">{period.nama}</div>
                                            <div className="extra-small text-muted">ID: #{period.id}</div>
                                        </td>
                                        <td><span className="badge bg-light text-dark border">{period.tahun}</span></td>
                                        <td>
                                            <div className="small fw-medium">
                                                {new Date(period.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(period.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input cursor-pointer" 
                                                    type="checkbox" 
                                                    checked={period.is_active}
                                                    onChange={() => handleToggleActive(period.id)}
                                                />
                                                <span className={`badge rounded-pill ${period.is_active ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-light text-muted border'} ms-2`}>
                                                    {period.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-end px-4">
                                            <button 
                                                className="btn btn-sm btn-light border rounded-circle me-2"
                                                onClick={() => handleOpenModal(period)}
                                                title="Edit"
                                            >
                                                <i className="bi bi-pencil small"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-light border text-danger rounded-circle"
                                                onClick={() => handleDelete(period.id)}
                                                title="Hapus"
                                            >
                                                <i className="bi bi-trash small"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <EmptyState 
                    icon="calendar-x"
                    title="Belum ada periode"
                    message="Silakan buat periode assessment pertama Anda."
                    action={{ label: 'Tambah Periode', onClick: () => handleOpenModal() }}
                />
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 p-4 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {selectedPeriod ? 'Edit Periode' : 'Tambah Periode Baru'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-uppercase">Nama Periode</label>
                                        <input 
                                            type="text" 
                                            className="form-control border-2" 
                                            placeholder="Contoh: Semester Ganjil 2024"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-uppercase">Tahun</label>
                                        <input 
                                            type="number" 
                                            className="form-control border-2" 
                                            value={formData.tahun}
                                            onChange={(e) => setFormData({...formData, tahun: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-uppercase">Tanggal Mulai</label>
                                            <input 
                                                type="date" 
                                                className="form-control border-2" 
                                                value={formData.tanggal_mulai}
                                                onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-uppercase">Tanggal Selesai</label>
                                            <input 
                                                type="date" 
                                                className="form-control border-2" 
                                                value={formData.tanggal_selesai}
                                                onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-light p-3 rounded-3 mt-2">
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="isActiveSwitch"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                            />
                                            <label className="form-check-label fw-medium" htmlFor="isActiveSwitch">
                                                Aktifkan periode ini sekarang
                                            </label>
                                        </div>
                                        <p className="text-muted extra-small mb-0 mt-1 ms-1">Mengaktifkan periode ini akan menonaktifkan periode lain yang sedang berjalan.</p>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                                        {selectedPeriod ? 'Simpan Perubahan' : 'Simpan Periode'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-success-subtle { background-color: #e8f5e9; }
                .bg-danger-subtle { background-color: #ffebee; }
            `}</style>
        </div>
    );
};

export default PeriodsPage;
