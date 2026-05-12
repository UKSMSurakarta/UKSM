import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsApi, saveAnswersApi, submitFinalApi, uploadBuktiApi } from '../../api/assessment';
import { toast } from 'react-toastify';

const IsiLevelPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [levelStatus, setLevelStatus] = useState('locked');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await getQuestionsApi(id);
            if (response.success) {
                setQuestions(response.data);
                setLevelStatus(response.level_status);
                
                const initialAnswers = {};
                response.data.forEach(q => {
                    if (q.jawabans && q.jawabans.length > 0) {
                        const jawapan = q.jawabans[0];
                        initialAnswers[q.id] = {
                            pertanyaan_id: q.id,
                            jawaban_teks: jawapan.jawaban_teks,
                            nilai: jawapan.nilai,
                            file_path: jawapan.file_path
                        };
                    } else {
                        initialAnswers[q.id] = { 
                            pertanyaan_id: q.id, 
                            jawaban_teks: '', 
                            nilai: 0, 
                            file_path: null 
                        };
                    }
                });
                setAnswers(initialAnswers);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (pertanyaanId, field, value, extra = {}) => {
        setAnswers(prev => ({
            ...prev,
            [pertanyaanId]: {
                ...prev[pertanyaanId],
                [field]: value,
                ...extra
            }
        }));
    };

    const handleFileUpload = async (pertanyaanId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setSaving(true);
            const response = await uploadBuktiApi(formData);
            if (response.success) {
                handleInputChange(pertanyaanId, 'file_path', response.data.path);
                toast.success('File berhasil diunggah.');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const saveDraft = async () => {
        setSaving(true);
        try {
            const jawabansArray = Object.values(answers);
            const response = await saveAnswersApi(id, jawabansArray);
            if (response.success) {
                toast.success('Progress berhasil disimpan sebagai draft.');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const submitFinal = async () => {
        try {
            const response = await submitFinalApi(id);
            if (response.success) {
                toast.success('Assessment level ini telah difinalisasi.');
                navigate('/sekolah/assessment');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

    const isReadOnly = levelStatus === 'final' || levelStatus === 'verified';

    return (
        <div className="container mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm sticky-top" style={{ top: '10px', zIndex: 1000 }}>
                <div>
                    <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => navigate('/sekolah/assessment')}>
                        <i className="bi bi-chevron-left"></i> Kembali
                    </button>
                    <span className="fw-bold fs-5">Mengisi Assessment</span>
                </div>
                <div className="d-flex align-items-center">
                    {saving && <span className="text-muted small me-3"><span className="spinner-border spinner-border-sm me-1"></span> Menyimpan...</span>}
                    {!isReadOnly && (
                        <>
                            <button className="btn btn-outline-primary me-2" onClick={saveDraft} disabled={saving}>Simpan Draft</button>
                            <button className="btn btn-danger" onClick={() => setShowConfirmModal(true)} disabled={saving}>Submit Final</button>
                        </>
                    )}
                </div>
            </div>

            {isReadOnly && (
                <div className={`alert ${levelStatus === 'verified' ? 'alert-primary' : 'alert-success'} border-0 shadow-sm mb-4`}>
                    <i className={`bi ${levelStatus === 'verified' ? 'bi-patch-check-fill' : 'bi-check-circle-fill'} me-2`}></i>
                    {levelStatus === 'verified' ? 'Level ini telah diverifikasi oleh Admin. Jawaban Anda tidak dapat diubah lagi.' : 'Level ini sudah difinalisasi. Jawaban Anda tidak dapat diubah lagi.'}
                </div>
            )}

            <div className="row justify-content-center">
                <div className="col-lg-9">
                    {questions.map((q, index) => (
                        <div key={q.id} className="card shadow-sm border-0 mb-4 p-3 p-md-4">
                            <div className="d-flex mb-3">
                                <span className="badge bg-primary me-3 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px', borderRadius: '50%' }}>
                                    {index + 1}
                                </span>
                                <h5 className="fw-bold m-0 lh-base">{q.teks_pertanyaan} {q.is_required && <span className="text-danger">*</span>}</h5>
                            </div>

                            <div className="ms-md-5">
                                {q.tipe_jawaban === 'ya_tidak' && (
                                    <div className="d-flex gap-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name={`q_${q.id}`} 
                                                checked={answers[q.id]?.jawaban_teks === 'Ya'}
                                                onChange={() => handleInputChange(q.id, 'jawaban_teks', 'Ya', { nilai: q.bobot })}
                                                disabled={isReadOnly}
                                            />
                                            <label className="form-check-label fw-medium">Ya</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name={`q_${q.id}`} 
                                                checked={answers[q.id]?.jawaban_teks === 'Tidak'}
                                                onChange={() => handleInputChange(q.id, 'jawaban_teks', 'Tidak', { nilai: 0 })}
                                                disabled={isReadOnly}
                                            />
                                            <label className="form-check-label fw-medium">Tidak</label>
                                        </div>
                                    </div>
                                )}

                                {q.tipe_jawaban === 'pilihan_ganda' && (
                                    <div className="d-grid gap-2">
                                        {q.pilihan_jawabans.map(opt => (
                                            <div key={opt.id} className="form-check p-3 border rounded hover-bg-light">
                                                <input className="form-check-input ms-0 me-3" type="radio" name={`q_${q.id}`} 
                                                    checked={answers[q.id]?.jawaban_teks === opt.teks}
                                                    onChange={() => handleInputChange(q.id, 'jawaban_teks', opt.teks, { nilai: opt.nilai })}
                                                    disabled={isReadOnly}
                                                />
                                                <label className="form-check-label w-100">{opt.teks}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {q.tipe_jawaban === 'isian' && (
                                    <textarea 
                                        className="form-control border-2" 
                                        rows="3" 
                                        placeholder="Masukkan jawaban Anda..."
                                        value={answers[q.id]?.jawaban_teks || ''}
                                        onChange={(e) => handleInputChange(q.id, 'jawaban_teks', e.target.value)}
                                        disabled={isReadOnly}
                                    ></textarea>
                                )}

                                {q.tipe_jawaban === 'upload' && (
                                    <div>
                                        {!isReadOnly && (
                                            <input type="file" className="form-control mb-2" onChange={(e) => handleFileUpload(q.id, e)} />
                                        )}
                                        {answers[q.id]?.file_path && (
                                            <div className="p-2 border rounded d-flex align-items-center bg-light">
                                                <i className="bi bi-file-earmark-check text-success fs-4 me-2"></i>
                                                <span className="small text-truncate me-auto">{answers[q.id].file_path.split('/').pop()}</span>
                                                <a href={`${import.meta.env.VITE_API_BASE_URL}/storage/${answers[q.id].file_path}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-link">Lihat File</a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showConfirmModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Konfirmasi Submit Final</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted">Apakah Anda yakin ingin memfinalisasi level ini? <br /><strong>Setelah di-submit, jawaban Anda tidak dapat diubah kembali.</strong></p>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-light fw-bold" onClick={() => setShowConfirmModal(false)}>Batal</button>
                                <button type="button" className="btn btn-danger fw-bold" onClick={() => { submitFinal(); setShowConfirmModal(false); }}>Ya, Submit Sekarang</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IsiLevelPage;
