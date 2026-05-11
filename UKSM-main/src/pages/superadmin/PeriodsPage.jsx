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
            // Error handled by interceptor or validation helper
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

    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Periode Assessment</h2>
                    <p className="text-muted">Kelola jadwal periode pengisian instrumen UKS.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <i className="bi bi-plus-lg me-2"></i>Tambah Periode
                </button>
            </div>

            {loading ? (
                <LoadingSkeleton.Table rows={5} cols={6} />
            ) : periods && periods.length > 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Nama Periode</th>
                                    <th>Tahun</th>
                                    <th>Tanggal Mulai</th>
                                    <th>Tanggal Selesai</th>
                                    <th>Status</th>
                                    <th className="text-end px-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((period) => (
                                    <tr key={period.id}>
                                        <td className="px-4 fw-medium">{period.nama}</td>
                                        <td>{period.tahun}</td>
                                        <td>{new Date(period.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                                        <td>{new Date(period.tanggal_selesai).toLocaleDateString('id-ID')}</td>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input cursor-pointer" 
                                                    type="checkbox" 
                                                    checked={period.is_active}
                                                    onChange={() => handleToggleActive(period.id)}
                                                />
                                                <span className={`badge ${period.is_active ? 'bg-success' : 'bg-secondary'} ms-2`}>
                                                    {period.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-end px-4">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleOpenModal(period)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(period.id)}
                                            >
                                                <i className="bi bi-trash"></i>
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
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header border-bottom py-3">
                                    <h5 className="modal-title fw-bold">
                                        {selectedPeriod ? 'Edit Periode' : 'Tambah Periode Baru'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Nama Periode</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Contoh: Semester Ganjil 2024"
                                                value={formData.nama}
                                                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Tahun</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                value={formData.tahun}
                                                onChange={(e) => setFormData({...formData, tahun: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-medium">Tanggal Mulai</label>
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    value={formData.tanggal_mulai}
                                                    onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-medium">Tanggal Selesai</label>
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    value={formData.tanggal_selesai}
                                                    onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        <div className="form-check form-switch mt-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="isActiveSwitch"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                            />
                                            <label className="form-check-label" htmlFor="isActiveSwitch">
                                                Aktifkan periode ini sekarang
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-light border-top p-3">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                                        <button type="submit" className="btn btn-primary px-4">
                                            {selectedPeriod ? 'Simpan Perubahan' : 'Simpan Periode'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default PeriodsPage;
