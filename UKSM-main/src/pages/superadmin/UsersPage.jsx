import React, { useState, useEffect } from 'react';
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi, toggleUserActiveApi, resetUserPasswordApi, getOpdsApi, getSekolahsApi } from '../../api/superadmin';
import DataTable from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-toastify';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    
    const [opds, setOpds] = useState([]);
    const [sekolahs, setSekolahs] = useState([]);
    
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    
    const [form, setForm] = useState({
        name: '', email: '', role: 'admin', opd_id: '', sekolah_id: '', password: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchOptions();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsersApi({ page });
            setUsers(res.data.data);
            setPagination(res.data);
        } catch (error) {
            toast.error('Gagal mengambil data user.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const [opdRes, sekolahRes] = await Promise.all([getOpdsApi(), getSekolahsApi({ limit: 100 })]);
            setOpds(opdRes.data);
            setSekolahs(sekolahRes.data.data);
        } catch (error) {
            console.error('Error fetching options');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await updateUserApi(selectedUser.id, form);
                toast.success('User berhasil diperbarui.');
            } else {
                await createUserApi(form);
                toast.success('User berhasil dibuat.');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan.');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUserApi(selectedUser.id);
            toast.success('User berhasil dihapus.');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            toast.error('Gagal menghapus user.');
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await toggleUserActiveApi(id);
            toast.success('Status user diperbarui.');
            fetchUsers();
        } catch (error) {
            toast.error('Gagal memperbarui status.');
        }
    };

    const handleResetPassword = async (id) => {
        if (!window.confirm('Reset password user ini?')) return;
        try {
            const res = await resetUserPasswordApi(id);
            toast.success(`Password baru: ${res.data.new_password}`, { autoClose: false });
        } catch (error) {
            toast.error('Gagal reset password.');
        }
    };

    const columns = [
        { 
            label: 'Nama & Email', 
            render: (row) => (
                <div>
                    <div className="fw-bold">{row.name}</div>
                    <div className="text-muted extra-small">{row.email}</div>
                </div>
            ) 
        },
        { 
            label: 'Role', 
            render: (row) => <span className="badge bg-primary-subtle text-primary text-uppercase small">{row.role}</span> 
        },
        { 
            label: 'Instansi', 
            render: (row) => row.opd?.nama || row.sekolah?.nama || '-' 
        },
        { 
            label: 'Status', 
            render: (row) => (
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={row.is_active} 
                        onChange={() => handleToggleActive(row.id)} 
                    />
                    <small className={row.is_active ? 'text-success' : 'text-danger'}>
                        {row.is_active ? 'Aktif' : 'Nonaktif'}
                    </small>
                </div>
            ) 
        },
        {
            label: 'Pass',
            render: (row) => (
                <button className="btn btn-sm btn-outline-warning" onClick={() => handleResetPassword(row.id)}>
                    <i className="bi bi-key"></i>
                </button>
            )
        }
    ];

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Manajemen User</h4>
                <button 
                    className="btn btn-primary rounded-pill px-4 shadow-sm" 
                    onClick={() => { setSelectedUser(null); setForm({ name: '', email: '', role: 'admin', opd_id: '', sekolah_id: '', password: '' }); setShowModal(true); }}
                >
                    <i className="bi bi-plus-lg me-2"></i> Tambah User
                </button>
            </div>

            <DataTable 
                columns={columns} 
                data={users} 
                loading={loading} 
                pagination={pagination}
                onPageChange={setPage}
                onEdit={(user) => { setSelectedUser(user); setForm({...user}); setShowModal(true); }}
                onDelete={(user) => { setSelectedUser(user); setShowDeleteModal(true); }}
            />

            {/* Modal Form */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <form onSubmit={handleSave}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">{selectedUser ? 'Edit User' : 'Tambah User Baru'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Nama Lengkap</label>
                                        <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Email</label>
                                        <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Role</label>
                                        <select className="form-select" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                                            <option value="superadmin">Superadmin</option>
                                            <option value="admin">Admin Wilayah (Dinas)</option>
                                            <option value="user">User Konten</option>
                                            <option value="sekolah">Operator Sekolah</option>
                                        </select>
                                    </div>
                                    {(form.role === 'admin' || form.role === 'user') && (
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-muted">Pilih OPD</label>
                                            <select className="form-select" value={form.opd_id} onChange={(e) => setForm({...form, opd_id: e.target.value})} required>
                                                <option value="">-- Pilih OPD --</option>
                                                {opds.map(o => <option key={o.id} value={o.id}>{o.nama}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    {form.role === 'sekolah' && (
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-muted">Pilih Sekolah</label>
                                            <select className="form-select" value={form.sekolah_id} onChange={(e) => setForm({...form, sekolah_id: e.target.value})} required>
                                                <option value="">-- Pilih Sekolah --</option>
                                                {sekolahs.map(s => <option key={s.id} value={s.id}>{s.nama} ({s.npsn})</option>)}
                                            </select>
                                        </div>
                                    )}
                                    {!selectedUser && (
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-muted">Password (Kosongkan untuk auto-generate)</label>
                                            <input type="text" className="form-control" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary fw-bold px-4">Simpan User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                show={showDeleteModal}
                title="Hapus User?"
                message={`Anda yakin ingin menghapus user ${selectedUser?.name}? Akun ini tidak akan bisa login lagi.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-primary-subtle { background-color: #e7f1ff; }
            `}</style>
        </div>
    );
};

export default UsersPage;
