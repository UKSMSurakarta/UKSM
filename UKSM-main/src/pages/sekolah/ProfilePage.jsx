import React, { useState, useEffect } from 'react';
import { getProfileApi, updateProfileApi } from '../../api/assessment';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        alamat: '',
        telepon: '',
        email_sekolah: '',
        akreditasi: '',
        kepala_sekolah: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getProfileApi();
            setData(res.data);
            setFormData({
                alamat: res.data.sekolah.alamat || '',
                telepon: res.data.sekolah.telepon || '',
                email_sekolah: res.data.sekolah.email_sekolah || '',
                akreditasi: res.data.sekolah.akreditasi || '',
                kepala_sekolah: res.data.sekolah.kepala_sekolah || ''
            });
        } catch (error) {
            toast.error('Gagal mengambil data profil sekolah.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfileApi(formData);
            toast.success('Profil berhasil diperbarui!');
            setShowEdit(false);
            fetchProfile();
        } catch (error) {
            toast.error(error.message || 'Gagal memperbarui profil.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary"></div>
                <p className="mt-3 text-muted">Memuat profil sekolah...</p>
            </div>
        );
    }

    if (!data) return null;

    const { sekolah, stats } = data;

    return (
        <div className="container-fluid pb-5">
            {/* Header Section */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden bg-white">
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-column flex-md-row align-items-center">
                        <div className="bg-primary-subtle text-primary rounded-4 p-4 me-md-4 mb-3 mb-md-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px' }}>
                            <i className="bi bi-building-fill fs-1"></i>
                        </div>
                        <div className="text-center text-md-start flex-grow-1">
                            <h2 className="fw-bold text-dark mb-1">{sekolah.nama}</h2>
                            <p className="text-muted mb-3 fs-5">Sekolah Peserta Penilaian UKS Digital</p>
                            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                                <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-medium">
                                    <i className="bi bi-patch-check-fill me-1"></i> Sekolah Aktif
                                </span>
                                {stats.is_verified && (
                                    <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fw-medium">
                                        <i className="bi bi-shield-check me-1"></i> Terverifikasi
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 mt-md-0">
                            <button 
                                className="btn btn-outline-primary rounded-pill px-4"
                                onClick={() => setShowEdit(true)}
                            >
                                <i className="bi bi-pencil-square me-2"></i> Edit Profil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Identitas Sekolah */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-header bg-white border-0 py-4 px-4">
                            <h5 className="fw-bold m-0 d-flex align-items-center">
                                <i className="bi bi-shield-lock me-2 text-primary fs-4"></i> Identitas Sekolah
                            </h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <div className="list-group list-group-flush border-top border-light">
                                <div className="list-group-item bg-transparent py-3 px-0 border-light d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-bank text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">Nama Sekolah</div>
                                        <div className="fw-bold text-dark">{sekolah.nama}</div>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent py-3 px-0 border-light d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-person-badge text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">Kepala Sekolah</div>
                                        <div className="fw-bold text-dark">{sekolah.kepala_sekolah || '-'}</div>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent py-3 px-0 border-light d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-check-circle text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">NPSN</div>
                                        <div className="fw-bold text-dark">{sekolah.npsn}</div>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent py-3 px-0 border-0 d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-calendar-check text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">Tahun Bergabung</div>
                                        <div className="fw-bold text-dark">{sekolah.tahun_bergabung || '2026'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kontak & Lokasi */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-header bg-white border-0 py-4 px-4">
                            <h5 className="fw-bold m-0 d-flex align-items-center">
                                <i className="bi bi-envelope-at me-2 text-primary fs-4"></i> Kontak & Lokasi
                            </h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <div className="list-group list-group-flush border-top border-light">
                                <div className="list-group-item bg-transparent py-3 px-0 border-light d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-geo-alt text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">Alamat</div>
                                        <div className="fw-bold text-dark">{sekolah.alamat || '-'}</div>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent py-3 px-0 border-light d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-telephone text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">Nomor Telepon</div>
                                        <div className="fw-bold text-dark">{sekolah.telepon || '-'}</div>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent py-3 px-0 border-light d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-envelope text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">Email Sekolah</div>
                                        <div className="fw-bold text-dark">{sekolah.email_sekolah || '-'}</div>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent py-3 px-0 border-0 d-flex align-items-center">
                                    <div className="rounded-3 bg-light p-2 me-3"><i className="bi bi-mortarboard text-secondary"></i></div>
                                    <div>
                                        <div className="text-muted extra-small">Akreditasi</div>
                                        <div className="fw-bold text-dark">{sekolah.akreditasi || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {showEdit && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow rounded-4">
                                <div className="modal-header border-0 pt-4 px-4">
                                    <h5 className="modal-title fw-bold">Edit Kontak & Lokasi</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
                                </div>
                                <form onSubmit={handleUpdate}>
                                    <div className="modal-body px-4">
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Nama Kepala Sekolah</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={formData.kepala_sekolah}
                                                onChange={(e) => setFormData({...formData, kepala_sekolah: e.target.value})}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Alamat Sekolah</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="2"
                                                value={formData.alamat}
                                                onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                                            ></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label small fw-bold">Nomor Telepon</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={formData.telepon}
                                                    onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label small fw-bold">Akreditasi</label>
                                                <select 
                                                    className="form-select"
                                                    value={formData.akreditasi}
                                                    onChange={(e) => setFormData({...formData, akreditasi: e.target.value})}
                                                >
                                                    <option value="">Pilih</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                    <option value="Tidak">Tidak Terakreditasi</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Email Sekolah</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                value={formData.email_sekolah}
                                                onChange={(e) => setFormData({...formData, email_sekolah: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 pb-4 px-4">
                                        <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowEdit(false)}>Batal</button>
                                        <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={saving}>
                                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Penilaian UKS */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 bg-white">
                        <div className="card-body p-4 p-md-5">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h4 className="fw-bold text-dark mb-1">Status Penilaian UKS</h4>
                                    <p className="text-muted small mb-0">Ringkasan progres penilaian sekolah</p>
                                </div>
                                <span className={`badge rounded-pill px-4 py-2 fw-bold ${stats.progress === 100 ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'}`}>
                                    {stats.progress === 100 ? 'Selesai' : 'Dalam Proses'}
                                </span>
                            </div>

                            <div className="row g-4 text-center text-md-start">
                                <div className="col-md-4">
                                    <div className="p-4 rounded-4 border bg-light h-100">
                                        <div className="text-muted small mb-2">Kategori Selesai</div>
                                        <div className="fs-1 fw-bold text-dark">{stats.kategori_selesai}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-4 rounded-4 border bg-light h-100">
                                        <div className="text-muted small mb-2">Indikator Terisi</div>
                                        <div className="fs-1 fw-bold text-dark">{stats.indikator_terisi}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-4 rounded-4 border bg-light h-100">
                                        <div className="text-muted small mb-2">Progress</div>
                                        <div className="fs-1 fw-bold text-primary">{stats.progress}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-primary-subtle { background-color: #e7f1ff; }
                .bg-success-subtle { background-color: #e6fffa; }
                .bg-info-subtle { background-color: #e0f2fe; }
            `}</style>
        </div>
    );
};

export default ProfilePage;
