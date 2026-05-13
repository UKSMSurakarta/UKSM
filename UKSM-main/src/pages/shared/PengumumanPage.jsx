import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import {
    getPengumumansApi,
    createPengumumanApi,
    updatePengumumanApi,
    deletePengumumanApi,
    getOpdListApi,
} from '../../api/pengumumanApi';

// ─── Modal Form Pengumuman ────────────────────────────────────────────────────
const PengumumanModal = ({ show, onClose, onSave, selected, role, opdList }) => {
    const isSuperadmin = role === 'superadmin';
    const [formData, setFormData] = useState({
        judul: '',
        isi: '',
        target_type: 'opd',
        opd_id: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (selected) {
            setFormData({
                judul: selected.judul,
                isi: selected.isi,
                target_type: selected.target_type,
                opd_id: selected.opd_id ?? '',
            });
        } else {
            setFormData({ judul: '', isi: '', target_type: 'opd', opd_id: '' });
        }
    }, [selected, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                judul: formData.judul,
                isi: formData.isi,
                ...(isSuperadmin && {
                    target_type: formData.target_type,
                    opd_id: formData.target_type === 'opd' ? formData.opd_id : null,
                }),
            };
            await onSave(payload);
            onClose();
        } catch (err) {
            if (err.response?.status === 422) {
                const firstErr = Object.values(err.response.data.errors)[0][0];
                toast.error(firstErr);
            }
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-header border-0 p-4 pb-0">
                        <div>
                            <h5 className="modal-title fw-bold">
                                {selected ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                            </h5>
                            <p className="text-muted small mb-0">
                                {isSuperadmin
                                    ? 'Pilih target penerima pengumuman.'
                                    : 'Pengumuman akan dikirim ke seluruh sekolah di dinas Anda.'}
                            </p>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Judul Pengumuman</label>
                                <input
                                    type="text"
                                    className="form-control border-2"
                                    placeholder="Masukkan judul pengumuman..."
                                    value={formData.judul}
                                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Target Audience (Superadmin only) */}
                            {isSuperadmin && !selected && (
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-uppercase">Target Penerima</label>
                                    <div className="d-flex gap-3 mb-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="targetAll"
                                                value="all"
                                                checked={formData.target_type === 'all'}
                                                onChange={() => setFormData({ ...formData, target_type: 'all', opd_id: '' })}
                                            />
                                            <label className="form-check-label fw-medium" htmlFor="targetAll">
                                                <i className="bi bi-broadcast me-1 text-primary"></i>
                                                Semua Sekolah
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="targetOpd"
                                                value="opd"
                                                checked={formData.target_type === 'opd'}
                                                onChange={() => setFormData({ ...formData, target_type: 'opd' })}
                                            />
                                            <label className="form-check-label fw-medium" htmlFor="targetOpd">
                                                <i className="bi bi-building me-1 text-warning"></i>
                                                Dinas / OPD Tertentu
                                            </label>
                                        </div>
                                    </div>

                                    {formData.target_type === 'all' && (
                                        <div className="alert alert-primary py-2 small d-flex align-items-center">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Pengumuman akan dikirim ke <strong className="mx-1">seluruh sekolah</strong> yang terdaftar.
                                        </div>
                                    )}

                                    {formData.target_type === 'opd' && (
                                        <select
                                            className="form-select border-2"
                                            value={formData.opd_id}
                                            onChange={(e) => setFormData({ ...formData, opd_id: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Pilih Dinas / OPD --</option>
                                            {opdList.map((opd) => (
                                                <option key={opd.id} value={opd.id}>{opd.nama}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Isi Pengumuman</label>
                                <textarea
                                    className="form-control border-2"
                                    rows="7"
                                    placeholder="Tuliskan isi pengumuman di sini..."
                                    value={formData.isi}
                                    onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            {!selected && (
                                <div className="bg-warning-subtle border border-warning-subtle rounded-3 p-3 small">
                                    <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                                    Pengumuman yang disimpan <strong>langsung dikirimkan</strong> sebagai notifikasi ke sekolah tujuan dan tidak dapat ditarik kembali.
                                </div>
                            )}
                        </div>
                        <div className="modal-footer border-0 p-4 pt-0">
                            <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>
                                Batal
                            </button>
                            <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={saving}>
                                {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {selected ? 'Simpan Perubahan' : (
                                    <><i className="bi bi-send me-2"></i>Kirim Pengumuman</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PengumumanPage = () => {
    const { user } = useAuth();
    const role = user?.role;

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [opdList, setOpdList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPengumumansApi(role);
            const data = res.data?.data?.data ?? res.data?.data ?? [];
            setList(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Gagal mengambil data pengumuman.');
        } finally {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchData();
        if (role === 'superadmin') {
            getOpdListApi().then((res) => setOpdList(res.data?.data ?? []));
        }
    }, [fetchData, role]);

    const handleSave = async (payload) => {
        if (selected) {
            await updatePengumumanApi(role, selected.id, payload);
            toast.success('Pengumuman berhasil diperbarui.');
        } else {
            await createPengumumanApi(role, payload);
            toast.success('Pengumuman berhasil dikirim ke sekolah!');
        }
        fetchData();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pengumuman ini?')) return;
        try {
            await deletePengumumanApi(role, id);
            toast.success('Pengumuman dihapus.');
            fetchData();
        } catch {
            toast.error('Gagal menghapus pengumuman.');
        }
    };

    const handleEdit = (item) => {
        setSelected(item);
        setShowModal(true);
    };

    const handleCreate = () => {
        setSelected(null);
        setShowModal(true);
    };

    const filtered = list.filter((p) =>
        p.judul?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTargetBadge = (item) => {
        if (item.target_type === 'all') {
            return <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3"><i className="bi bi-broadcast me-1"></i>Semua Sekolah</span>;
        }
        return (
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3">
                <i className="bi bi-building me-1"></i>{item.opd?.nama ?? 'OPD Tertentu'}
            </span>
        );
    };

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
                <div>
                    <h4 className="fw-bold m-0">Kelola Pengumuman</h4>
                    <p className="text-muted small mb-0">
                        {role === 'superadmin'
                            ? 'Buat dan kirim pengumuman ke semua sekolah atau dinas tertentu.'
                            : 'Buat dan kirim pengumuman ke sekolah-sekolah di dinas Anda.'}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm shadow-sm"
                        placeholder="Cari pengumuman..."
                        style={{ width: '220px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={handleCreate}>
                        <i className="bi bi-megaphone me-2"></i>Buat Pengumuman
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                        <div className="bg-primary-subtle text-primary rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-megaphone fs-4"></i>
                        </div>
                        <div>
                            <div className="fw-bold fs-4 text-dark">{list.length}</div>
                            <div className="text-muted small">Total Pengumuman</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                        <div className="bg-success-subtle text-success rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-send-check fs-4"></i>
                        </div>
                        <div>
                            <div className="fw-bold fs-4 text-dark">{list.filter(p => p.is_published).length}</div>
                            <div className="text-muted small">Sudah Dikirim</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                        <div className="bg-warning-subtle text-warning rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-broadcast fs-4"></i>
                        </div>
                        <div>
                            <div className="fw-bold fs-4 text-dark">{list.filter(p => p.target_type === 'all').length}</div>
                            <div className="text-muted small">Broadcast ke Semua</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 small fw-bold text-uppercase">Judul Pengumuman</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase">Target</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase">Pengirim</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase">Tanggal Kirim</th>
                                <th className="py-3 border-0 small fw-bold text-uppercase text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                        <div className="mt-2 text-muted small">Memuat pengumuman...</div>
                                    </td>
                                </tr>
                            ) : filtered.length > 0 ? (
                                filtered.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">
                                            <div className="fw-bold text-dark">{item.judul}</div>
                                            <div className="text-muted extra-small mt-1" style={{ maxWidth: '350px' }}>
                                                {item.isi?.length > 100 ? item.isi.substring(0, 100) + '...' : item.isi}
                                            </div>
                                        </td>
                                        <td className="py-3">{getTargetBadge(item)}</td>
                                        <td className="py-3">
                                            <div className="small fw-medium">{item.sender?.name ?? '-'}</div>
                                        </td>
                                        <td className="py-3">
                                            <div className="small text-dark">
                                                {item.published_at
                                                    ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : '-'}
                                            </div>
                                            <div className="extra-small text-muted">
                                                {item.published_at
                                                    ? new Date(item.published_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                                    : ''}
                                            </div>
                                        </td>
                                        <td className="text-center py-3">
                                            <button
                                                className="btn btn-sm btn-light border rounded-circle me-2"
                                                title="Edit"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <i className="bi bi-pencil small"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-light border text-danger rounded-circle"
                                                title="Hapus"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <i className="bi bi-trash small"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="text-muted mb-2">
                                            <i className="bi bi-megaphone fs-1 opacity-25"></i>
                                        </div>
                                        <h6 className="fw-bold text-dark">Belum ada pengumuman</h6>
                                        <p className="text-muted small mb-3">Mulai buat pengumuman untuk sekolah-sekolah binaan Anda.</p>
                                        <button className="btn btn-primary rounded-pill px-4" onClick={handleCreate}>
                                            <i className="bi bi-megaphone me-2"></i>Buat Pengumuman Pertama
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <PengumumanModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                selected={selected}
                role={role}
                opdList={opdList}
            />

            <style>{`
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default PengumumanPage;
