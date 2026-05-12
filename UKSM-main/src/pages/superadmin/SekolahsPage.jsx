import React, { useState, useEffect } from 'react';
import { getSekolahsApi, createSekolahApi, updateSekolahApi, deleteSekolahApi, getOpdsApi } from '../../api/superadmin';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const SekolahsPage = () => {
    const [sekolahs, setSekolahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [opds, setOpds] = useState([]);
    
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSekolah, setSelectedSekolah] = useState(null);
    
    const [form, setForm] = useState({
        nama: '', npsn: '', jenjang: 'SD', opd_id: '', alamat: '', kepala_sekolah: ''
    });

    useEffect(() => {
        fetchSekolahs();
        fetchOpds();
    }, [page]);

    const fetchSekolahs = async () => {
        setLoading(true);
        try {
            const res = await getSekolahsApi({ page });
            setSekolahs(res.data.data);
            setPagination(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data sekolah.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOpds = async () => {
        try {
            const res = await getOpdsApi();
            setOpds(res.data);
        } catch (error) {
            console.error('Error fetching OPDs');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (selectedSekolah) {
                await updateSekolahApi(selectedSekolah.id, form);
                toast.success('Data sekolah diperbarui.');
            } else {
                await createSekolahApi(form);
                toast.success('Sekolah berhasil ditambahkan.');
            }
            setShowModal(false);
            fetchSekolahs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan.');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteSekolahApi(selectedSekolah.id);
            if (res.success) {
                toast.success('Sekolah berhasil dihapus.');
                setShowDeleteModal(false);
                fetchSekolahs();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Gagal menghapus sekolah. Pastikan tidak ada akun user yang terhubung.');
        }
    };

    const columns = [
        { 
            label: 'Sekolah & NPSN', 
            render: (row) => (
                <div>
                    <div className="fw-bold">{row.nama}</div>
                    <div className="text-muted extra-small">NPSN: {row.npsn}</div>
                </div>
            ) 
        },
        { 
            label: 'Jenjang', 
            render: (row) => <span className="badge bg-light text-dark border">{row.jenjang}</span> 
        },
        { 
            label: 'OPD / Pembina', 
            render: (row) => row.opd?.nama || '-' 
        },
        { label: 'Kepala Sekolah', key: 'kepala_sekolah' }
    ];

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Manajemen Sekolah</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary rounded-pill px-4 shadow-sm" onClick={() => toast.info('Fitur Import Excel sedang dikembangkan.')}>
                        <i className="bi bi-file-earmark-excel me-2"></i> Import Excel
                    </button>
                    <button 
                        className="btn btn-primary rounded-pill px-4 shadow-sm" 
                        onClick={() => { setSelectedSekolah(null); setForm({ nama: '', npsn: '', jenjang: 'SD', opd_id: '', alamat: '', kepala_sekolah: '' }); setShowModal(true); }}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Tambah Sekolah
                    </button>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={sekolahs} 
                loading={loading} 
                pagination={pagination}
                onPageChange={setPage}
                onEdit={(s) => { setSelectedSekolah(s); setForm({...s}); setShowModal(true); }}
                onDelete={(s) => { setSelectedSekolah(s); setShowDeleteModal(true); }}
            />

            {/* Modal Form */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <form onSubmit={handleSave}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">{selectedSekolah ? 'Edit Sekolah' : 'Tambah Sekolah Baru'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label small fw-bold text-muted">Nama Sekolah</label>
                                            <input type="text" className="form-control" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label small fw-bold text-muted">NPSN</label>
                                            <input type="text" className="form-control" value={form.npsn} onChange={(e) => setForm({...form, npsn: e.target.value})} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label small fw-bold text-muted">Jenjang</label>
                                            <select className="form-select" value={form.jenjang} onChange={(e) => setForm({...form, jenjang: e.target.value})}>
                                                <option value="TK">TK</option>
                                                <option value="SD">SD</option>
                                                <option value="SMP">SMP</option>
                                                <option value="SMA">SMA</option>
                                                <option value="SMK">SMK</option>
                                            </select>
                                        </div>
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label small fw-bold text-muted">Dinas Pembina (OPD)</label>
                                            <select className="form-select" value={form.opd_id} onChange={(e) => setForm({...form, opd_id: e.target.value})} required>
                                                <option value="">-- Pilih OPD --</option>
                                                {opds.map(o => <option key={o.id} value={o.id}>{o.nama}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-muted">Kepala Sekolah</label>
                                            <input type="text" className="form-control" value={form.kepala_sekolah} onChange={(e) => setForm({...form, kepala_sekolah: e.target.value})} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-muted">Nomor Telepon</label>
                                            <input type="text" className="form-control" value={form.telepon || ''} onChange={(e) => setForm({...form, telepon: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label small fw-bold text-muted">Email Sekolah</label>
                                            <input type="email" className="form-control" value={form.email_sekolah || ''} onChange={(e) => setForm({...form, email_sekolah: e.target.value})} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label small fw-bold text-muted">Akreditasi</label>
                                            <select className="form-select" value={form.akreditasi || ''} onChange={(e) => setForm({...form, akreditasi: e.target.value})}>
                                                <option value="">Pilih</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="Tidak">Tidak</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Alamat Lengkap</label>
                                        <textarea className="form-control" rows="2" value={form.alamat} onChange={(e) => setForm({...form, alamat: e.target.value})}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary fw-bold px-4">Simpan Sekolah</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                show={showDeleteModal}
                title="Hapus Sekolah?"
                message={`Anda yakin ingin menghapus ${selectedSekolah?.nama}? Semua data assessment sekolah ini juga akan terhapus.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default SekolahsPage;
