import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';

const MonitoringPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMonitoring = async () => {
            try {
                const response = await axiosInstance.get('/admin/monitoring');
                setData(response.data.data);
            } catch (error) {
                toast.error('Gagal mengambil data monitoring.');
            } finally {
                setLoading(false);
            }
        };
        fetchMonitoring();
    }, []);

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h4 className="fw-bold m-0">Monitoring Assessment</h4>
                <p className="text-muted small">Pantau progress pengisian instrumen oleh sekolah secara real-time.</p>
            </div>

            <div className="row g-4">
                {loading ? (
                    <>
                        <div className="col-xl-4 col-md-6"><CardSkeleton /></div>
                        <div className="col-xl-4 col-md-6"><CardSkeleton /></div>
                        <div className="col-xl-4 col-md-6"><CardSkeleton /></div>
                        <div className="col-xl-4 col-md-6"><CardSkeleton /></div>
                        <div className="col-xl-4 col-md-6"><CardSkeleton /></div>
                        <div className="col-xl-4 col-md-6"><CardSkeleton /></div>
                    </>
                ) : data.length > 0 ? (
                    data.map((sekolah) => (
                        <div key={sekolah.id} className="col-xl-4 col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <span className="badge bg-primary-subtle text-primary mb-2 me-1">{sekolah.jenjang}</span>
                                            {sekolah.total_skor > 0 && (
                                                <span className="badge bg-success-subtle text-success mb-2">Skor: {sekolah.total_skor}</span>
                                            )}
                                            <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '200px' }} title={sekolah.nama}>{sekolah.nama}</h6>
                                            <p className="text-muted extra-small mb-0">NPSN: {sekolah.npsn}</p>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold text-primary fs-4">{sekolah.progress_percent}%</div>
                                            <small className="text-muted extra-small">Progress</small>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-1">
                                            <i className="bi bi-person-badge extra-small text-muted me-2"></i>
                                            <span className="extra-small text-dark text-truncate">{sekolah.kepala_sekolah || '-'}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-telephone extra-small text-muted me-2"></i>
                                            <span className="extra-small text-dark">{sekolah.telepon || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="progress mb-4" style={{ height: '8px' }}>
                                        <div 
                                            className={`progress-bar rounded-pill ${sekolah.progress_percent === 100 ? 'bg-success' : 'bg-primary'}`} 
                                            role="progressbar" 
                                            style={{ width: `${sekolah.progress_percent}%` }}
                                        ></div>
                                    </div>

                                    <div className="row g-2 mb-4">
                                        <div className="col-4">
                                            <div className="p-2 bg-light rounded text-center">
                                                <div className="fw-bold text-dark">{sekolah.status_counts.draft}</div>
                                                <div className="extra-small text-muted">Draft</div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="p-2 bg-warning-subtle rounded text-center">
                                                <div className="fw-bold text-warning">{sekolah.status_counts.final}</div>
                                                <div className="extra-small text-muted">Final</div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="p-2 bg-success-subtle rounded text-center">
                                                <div className="fw-bold text-success">{sekolah.status_counts.verified}</div>
                                                <div className="extra-small text-muted">Verified</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <div className="extra-small text-muted">
                                            {sekolah.last_submit ? (
                                                <span><i className="bi bi-clock me-1"></i> Update: {new Date(sekolah.last_submit).toLocaleDateString()}</span>
                                            ) : (
                                                <span>Belum ada aktivitas</span>
                                            )}
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                            onClick={() => navigate(`/admin/verifikasi/${sekolah.id}`)}
                                        >
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <h5 className="text-muted">Tidak ada sekolah ditemukan di wilayah ini.</h5>
                    </div>
                )}
            </div>

            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-primary-subtle { background-color: #e7f1ff; }
                .bg-warning-subtle { background-color: #fff9e6; }
                .bg-success-subtle { background-color: #e8f5e9; }
                .transition-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.08)!important; }
            `}</style>
        </div>
    );
};

export default MonitoringPage;
