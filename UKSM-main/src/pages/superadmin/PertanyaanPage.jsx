import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByLevelApi, createQuestionApi, updateQuestionApi, deleteQuestionApi, reorderQuestionsApi } from '../../api/level';
import { toast } from 'react-toastify';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';

const PertanyaanPage = () => {
    const { levelId } = useParams();
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [formData, setFormData] = useState({
        teks_pertanyaan: '',
        tipe_jawaban: 'ya_tidak',
        bobot: 1,
        urutan: 1,
        is_required: true,
        pilihan_jawabans: []
    });

    useEffect(() => {
        fetchQuestions();
    }, [levelId]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const res = await getQuestionsByLevelApi(levelId);
            if (res.success) {
                setQuestions(res.data);
            }
        } catch (error) {
            toast.error('Gagal mengambil data pertanyaan.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (question = null) => {
        if (question) {
            setSelectedQuestion(question);
            setFormData({
                teks_pertanyaan: question.teks_pertanyaan,
                tipe_jawaban: question.tipe_jawaban,
                bobot: question.bobot,
                urutan: question.urutan,
                is_required: question.is_required,
                pilihan_jawabans: question.pilihan_jawabans || []
            });
        } else {
            setSelectedQuestion(null);
            setFormData({
                teks_pertanyaan: '',
                tipe_jawaban: 'ya_tidak',
                bobot: 1,
                urutan: questions.length + 1,
                is_required: true,
                pilihan_jawabans: []
            });
        }
        setShowModal(true);
    };

    const handleAddOption = () => {
        setFormData({
            ...formData,
            pilihan_jawabans: [...formData.pilihan_jawabans, { teks: '', nilai: 0 }]
        });
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...formData.pilihan_jawabans];
        newOptions.splice(index, 1);
        setFormData({ ...formData, pilihan_jawabans: newOptions });
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.pilihan_jawabans];
        newOptions[index][field] = value;
        setFormData({ ...formData, pilihan_jawabans: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation for choices
        if (formData.tipe_jawaban === 'pilihan_ganda' && formData.pilihan_jawabans.length < 2) {
            toast.warning('Harap berikan minimal 2 pilihan jawaban untuk tipe pilihan ganda.');
            return;
        }

        try {
            if (selectedQuestion) {
                await updateQuestionApi(selectedQuestion.id, formData);
                toast.success('Pertanyaan berhasil diperbarui');
            } else {
                await createQuestionApi(levelId, formData);
                toast.success('Pertanyaan berhasil ditambahkan');
            }
            setShowModal(false);
            fetchQuestions();
        } catch (err) {
            toast.error(err.message || 'Terjadi kesalahan.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
            try {
                await deleteQuestionApi(id);
                toast.success('Pertanyaan berhasil dihapus');
                fetchQuestions();
            } catch (err) {
                toast.error(err.message || 'Gagal menghapus pertanyaan.');
            }
        }
    };

    const getTipeBadge = (tipe) => {
        const types = {
            ya_tidak: { label: 'Ya / Tidak', color: 'primary' },
            pilihan_ganda: { label: 'Pilihan Ganda', color: 'info' },
            isian: { label: 'Isian / Teks', color: 'success' },
            upload: { label: 'Upload Berkas', color: 'warning' }
        };
        const t = types[tipe] || { label: tipe, color: 'secondary' };
        return <span className={`badge bg-${t.color}-subtle text-${t.color} border border-${t.color} rounded-pill px-2`}>{t.label}</span>;
    };

    return (
        <div className="container-fluid pb-5">
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-light rounded-circle me-3 border shadow-sm" onClick={() => navigate('/superadmin/levels')}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                    <h2 className="fw-bold text-dark mb-1">Kelola Pertanyaan</h2>
                    <p className="text-muted mb-0">Level ID: {levelId}</p>
                </div>
                <button className="btn btn-primary ms-auto shadow-sm" onClick={() => handleOpenModal()}>
                    <i className="bi bi-plus-lg me-2"></i>Tambah Pertanyaan
                </button>
            </div>

            {loading ? (
                <LoadingSkeleton.Table rows={5} cols={5} />
            ) : questions && questions.length > 0 ? (
                <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="small text-muted text-uppercase">
                                    <th className="px-4 py-3 border-0" style={{ width: '80px' }}>Urutan</th>
                                    <th className="py-3 border-0">Pertanyaan</th>
                                    <th className="py-3 border-0">Tipe Jawaban</th>
                                    <th className="py-3 border-0 text-center">Bobot</th>
                                    <th className="py-3 border-0 text-end px-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q) => (
                                    <tr key={q.id}>
                                        <td className="px-4 fw-bold text-center">
                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                {q.urutan}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-medium">{q.teks_pertanyaan}</div>
                                            {q.is_required && <span className="extra-small text-danger fw-bold">* Wajib diisi</span>}
                                        </td>
                                        <td>{getTipeBadge(q.tipe_jawaban)}</td>
                                        <td className="text-center fw-bold text-primary">{q.bobot}</td>
                                        <td className="text-end px-4">
                                            <div className="btn-group shadow-sm rounded-pill overflow-hidden border">
                                                <button className="btn btn-sm btn-white border-0" onClick={() => handleOpenModal(q)} title="Edit">
                                                    <i className="bi bi-pencil text-primary"></i>
                                                </button>
                                                <button className="btn btn-sm btn-white border-0" onClick={() => handleDelete(q.id)} title="Hapus">
                                                    <i className="bi bi-trash text-danger"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <EmptyState 
                    icon="patch-question"
                    title="Belum ada pertanyaan"
                    message="Level ini belum memiliki butir pertanyaan. Silakan buat pertanyaan pertama Anda."
                    action={{ label: 'Tambah Pertanyaan', onClick: () => handleOpenModal() }}
                />
            )}

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header border-0 p-4 pb-0">
                                    <h5 className="modal-title fw-bold">
                                        {selectedQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body p-4">
                                        <div className="mb-4">
                                            <label className="form-label fw-bold small text-muted text-uppercase">Teks Pertanyaan</label>
                                            <textarea 
                                                className="form-control border-2" 
                                                rows="3" 
                                                placeholder="Tuliskan kalimat pertanyaan di sini..."
                                                value={formData.teks_pertanyaan}
                                                onChange={(e) => setFormData({...formData, teks_pertanyaan: e.target.value})}
                                                required 
                                            ></textarea>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-4">
                                                <label className="form-label fw-bold small text-muted text-uppercase">Tipe Jawaban</label>
                                                <select 
                                                    className="form-select border-2"
                                                    value={formData.tipe_jawaban}
                                                    onChange={(e) => setFormData({...formData, tipe_jawaban: e.target.value})}
                                                    required
                                                >
                                                    <option value="ya_tidak">Ya / Tidak</option>
                                                    <option value="pilihan_ganda">Pilihan Ganda</option>
                                                    <option value="isian">Isian Teks</option>
                                                    <option value="upload">Upload File</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4 mb-4">
                                                <label className="form-label fw-bold small text-muted text-uppercase">Bobot Nilai (Maks)</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control border-2" 
                                                    value={formData.bobot}
                                                    onChange={(e) => setFormData({...formData, bobot: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="col-md-4 mb-4">
                                                <label className="form-label fw-bold small text-muted text-uppercase">Urutan</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control border-2" 
                                                    value={formData.urutan}
                                                    onChange={(e) => setFormData({...formData, urutan: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        {formData.tipe_jawaban === 'pilihan_ganda' && (
                                            <div className="p-4 bg-light rounded-4 mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="fw-bold mb-0">Pilihan Jawaban</h6>
                                                    <button type="button" className="btn btn-sm btn-outline-primary fw-bold" onClick={handleAddOption}>
                                                        <i className="bi bi-plus"></i> Tambah Pilihan
                                                    </button>
                                                </div>
                                                {formData.pilihan_jawabans.map((opt, index) => (
                                                    <div key={index} className="row g-2 mb-2 align-items-center">
                                                        <div className="col">
                                                            <input 
                                                                type="text" 
                                                                className="form-control form-control-sm border-2" 
                                                                placeholder={`Pilihan ${index + 1}`}
                                                                value={opt.teks}
                                                                onChange={(e) => handleOptionChange(index, 'teks', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-auto" style={{ width: '80px' }}>
                                                            <input 
                                                                type="number" 
                                                                className="form-control form-control-sm border-2" 
                                                                placeholder="Nilai"
                                                                value={opt.nilai}
                                                                onChange={(e) => handleOptionChange(index, 'nilai', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-auto">
                                                            <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => handleRemoveOption(index)}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {formData.pilihan_jawabans.length === 0 && (
                                                    <div className="text-center py-3 text-muted small italic">Klik "Tambah Pilihan" untuk membuat opsi jawaban.</div>
                                                )}
                                            </div>
                                        )}

                                        <div className="form-check form-switch mt-2">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="isRequiredSwitch"
                                                checked={formData.is_required}
                                                onChange={(e) => setFormData({...formData, is_required: e.target.checked})}
                                            />
                                            <label className="form-check-label fw-medium" htmlFor="isRequiredSwitch">
                                                Pertanyaan ini wajib diisi oleh sekolah
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 p-4 pt-0">
                                        <button type="button" className="btn btn-light fw-bold px-4" onClick={() => setShowModal(false)}>Batal</button>
                                        <button type="submit" className="btn btn-primary fw-bold px-4 shadow-sm">
                                            {selectedQuestion ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
                </>
            )}

            <style>{`
                .extra-small { font-size: 0.7rem; }
                .bg-primary-subtle { background-color: #e7f1ff; }
                .bg-info-subtle { background-color: #e1f5fe; }
                .bg-success-subtle { background-color: #e8f5e9; }
                .bg-warning-subtle { background-color: #fff9e6; }
                .ls-1 { letter-spacing: 1px; }
                .btn-white { background: #fff; }
                .btn-white:hover { background: #f8f9fa; }
            `}</style>
        </div>
    );
};

export default PertanyaanPage;
