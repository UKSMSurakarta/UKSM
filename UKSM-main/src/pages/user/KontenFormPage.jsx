import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createKontenApi, updateKontenApi, getKontenDetailApi } from '../../api/content';
import { toast } from 'react-toastify';
import ImageUploader from '../../components/ImageUploader';

const KontenFormPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        judul: '',
        tipe: searchParams.get('type') || 'berita',
        isi: '',
        is_published: false,
        thumbnail: null
    });
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            fetchDetail();
        }
    }, [id]);

    const fetchDetail = async () => {
        try {
            const res = await getKontenDetailApi(id);
            const data = res.data;
            setForm({
                judul: data.judul,
                tipe: data.tipe,
                isi: data.isi,
                is_published: data.is_published,
                thumbnail: null // reset thumbnail because we keep original unless changed
            });
        } catch (error) {
            toast.error('Gagal mengambil detail konten.');
            navigate('/user/kontens');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (publish = false) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('judul', form.judul);
            formData.append('tipe', form.tipe);
            formData.append('isi', form.isi);
            formData.append('is_published', publish ? 1 : 0);
            if (form.thumbnail) {
                formData.append('thumbnail', form.thumbnail);
            }

            if (isEdit) {
                await updateKontenApi(id, formData);
                toast.success('Konten berhasil diperbarui.');
            } else {
                await createKontenApi(formData);
                toast.success('Konten berhasil dibuat.');
            }
            navigate('/user/kontens');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan konten.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-2">
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-light rounded-circle me-3 border" onClick={() => navigate('/user/kontens')}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h4 className="fw-bold m-0">{isEdit ? 'Edit' : 'Tambah'} {form.tipe.charAt(0).toUpperCase() + form.tipe.slice(1)}</h4>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4">
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-uppercase text-muted">Judul Konten</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg border-2" 
                                placeholder="Masukkan judul menarik di sini..."
                                value={form.judul}
                                onChange={(e) => setForm({...form, judul: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold small text-uppercase text-muted">Isi Konten</label>
                            <textarea 
                                className="form-control border-2" 
                                rows="15" 
                                placeholder="Tuliskan isi konten Anda secara lengkap..."
                                value={form.isi}
                                onChange={(e) => setForm({...form, isi: e.target.value})}
                                required
                            ></textarea>
                            <small className="text-muted mt-2 d-block">Gunakan paragraf yang rapi untuk kenyamanan pembaca.</small>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 mb-4">
                        <h6 className="fw-bold mb-3">Pengaturan & Media</h6>
                        <hr className="mt-0 mb-4" />
                        
                        <div className="mb-4">
                            <ImageUploader 
                                onImageSelect={(file) => setForm({...form, thumbnail: file})} 
                                initialImage={null} 
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold small text-uppercase text-muted">Tipe Konten</label>
                            <select 
                                className="form-select border-2" 
                                value={form.tipe}
                                onChange={(e) => setForm({...form, tipe: e.target.value})}
                            >
                                <option value="berita">Berita</option>
                                <option value="pengumuman">Pengumuman</option>
                                <option value="agenda">Agenda</option>
                                <option value="galeri">Galeri</option>
                            </select>
                        </div>

                        <div className="d-grid gap-2">
                            <button 
                                className="btn btn-primary fw-bold py-3 shadow-sm" 
                                onClick={() => handleSubmit(true)}
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : (isEdit && form.is_published ? 'Simpan Perubahan' : 'Publish Sekarang')}
                            </button>
                            {!form.is_published && (
                                <button 
                                    className="btn btn-light fw-bold py-2 border" 
                                    onClick={() => handleSubmit(false)}
                                    disabled={loading}
                                >
                                    Simpan sebagai Draft
                                </button>
                            )}
                            <button className="btn btn-link text-muted small text-decoration-none mt-2" onClick={() => navigate('/user/kontens')}>Batalkan</button>
                        </div>
                    </div>
                    
                    <div className="card border-0 shadow-sm p-4 bg-light border-start border-primary border-4">
                        <h6 className="fw-bold small mb-2"><i className="bi bi-lightbulb text-primary me-2"></i>Tips Menulis</h6>
                        <ul className="extra-small text-muted mb-0 ps-3">
                            <li>Gunakan gambar thumbnail yang jernih dan relevan.</li>
                            <li>Judul sebaiknya tidak lebih dari 70 karakter.</li>
                            <li>Periksa kembali ejaan sebelum mempublikasikan.</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .form-control:focus, .form-select:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
                }
            `}</style>
        </div>
    );
};

export default KontenFormPage;
