import React, { useState, useEffect } from 'react';
import { getOpdsApi, createOpdApi, updateOpdApi, deleteOpdApi } from '../../api/superadmin';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const OpdsPage = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOpd, setSelectedOpd] = useState(null);
    
    const [form, setForm] = useState({ nama: '', kode: '', alamat: '' });

    useEffect(() => {
        fetchOpds();
    }, []);

    const fetchOpds = async () => {
        setLoading(true);
        try {
            const res = await getOpdsApi();
            setOpds(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data OPD.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (selectedOpd) {
                await updateOpdApi(selectedOpd.id, form);
                toast.success('Data OPD diperbarui.');
            } else {
                await createOpdApi(form);
                toast.success('OPD berhasil ditambahkan.');
            }
            setShowModal(false);
            fetchOpds();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan.');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteOpdApi(selectedOpd.id);
            if (res.success) {
                toast.success('OPD berhasil dihapus.');
                setShowDeleteModal(false);
                fetchOpds();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Gagal menghapus OPD. Pastikan tidak ada data sekolah yang terikat.');
        }
    };

    const columns = [
        { label: 'Kode OPD', key: 'kode', width: '150px' },
        { label: 'Nama Instansi / OPD', key: 'nama' },
        { 
            label: 'Total Sekolah', 
            render: (row) => <span className="badge bg-primary rounded-pill">{row.sekolahs_count || 0} Sekolah</span> 
        },
        { label: 'Alamat', key: 'alamat' }
    ];

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Manajemen OPD (Dinas)</h4>
                <button 
                    className="btn btn-primary rounded-pill px-4 shadow-sm" 
                    onClick={() => { setSelectedOpd(null); setForm({ nama: '', kode: '', alamat: '' }); setShowModal(true); }}
                >
                    <i className="bi bi-plus-lg me-2"></i> Tambah OPD
                </button>
            </div>

            <DataTable 
                columns={columns} 
                data={opds} 
                loading={loading} 
                onEdit={(o) => { setSelectedOpd(o); setForm({...o}); setShowModal(true); }}
                onDelete={(o) => { setSelectedOpd(o); setShowDeleteModal(true); }}
            />

            {/* Modal Form */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <form onSubmit={handleSave}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">{selectedOpd ? 'Edit OPD' : 'Tambah OPD Baru'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Kode OPD</label>
                                        <input type="text" className="form-control" value={form.kode} onChange={(e) => setForm({...form, kode: e.target.value})} placeholder="Contoh: DISDIK-01" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Nama Instansi</label>
                                        <input type="text" className="form-control" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} placeholder="Contoh: Dinas Pendidikan Kabupaten" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Alamat</label>
                                        <textarea className="form-control" rows="2" value={form.alamat} onChange={(e) => setForm({...form, alamat: e.target.value})}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary fw-bold px-4">Simpan OPD</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                show={showDeleteModal}
                title="Hapus OPD?"
                message={`Anda yakin ingin menghapus ${selectedOpd?.nama}? Data sekolah yang berada di bawah OPD ini harus dipindahkan terlebih dahulu.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default OpdsPage;
