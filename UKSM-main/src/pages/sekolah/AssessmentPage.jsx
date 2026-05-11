import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLevelsApi } from '../../api/assessment';
import { toast } from 'react-toastify';

const AssessmentPage = () => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLevels();
    }, []);

    const fetchLevels = async () => {
        try {
            const response = await getLevelsApi();
            if (response.success) {
                setLevels(response.data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'final': return <span className="badge bg-success">✅ Final</span>;
            case 'draft': return <span className="badge bg-warning text-dark">✏️ Sedang Dikerjakan</span>;
            case 'unlocked': return <span className="badge bg-primary">🔓 Terbuka</span>;
            case 'locked': return <span className="badge bg-secondary">🔒 Terkunci</span>;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <h2 className="mb-4 fw-bold">Assessment UKS</h2>
                <div className="row g-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="col-md-4">
                            <div className="card shadow-sm border-0 placeholder-glow" style={{ height: '200px' }}>
                                <div className="card-body">
                                    <div className="placeholder col-8 mb-3 py-3"></div>
                                    <div className="placeholder col-12 mb-2"></div>
                                    <div className="placeholder col-10"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">Assessment UKS</h2>
                <button className="btn btn-outline-primary btn-sm" onClick={fetchLevels}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </button>
            </div>

            <div className="row g-4">
                {levels.map((level) => (
                    <div key={level.id} className="col-md-6 col-lg-4">
                        <div className={`card h-100 shadow-sm border-0 ${level.status === 'locked' ? 'opacity-75' : ''}`}>
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title fw-bold m-0">{level.nama}</h5>
                                    {getStatusBadge(level.status)}
                                </div>
                                <p className="text-muted small mb-4">Level {level.urutan}</p>
                                
                                <div className="mt-auto">
                                    <div className="d-flex justify-content-between align-items-center mb-1 small">
                                        <span>Progres Pengisian</span>
                                        <span className="fw-bold">{level.progress}%</span>
                                    </div>
                                    <div className="progress mb-4" style={{ height: '10px' }}>
                                        <div 
                                            className={`progress-bar ${level.status === 'final' ? 'bg-success' : 'bg-primary'}`} 
                                            role="progressbar" 
                                            style={{ width: `${level.progress}%` }}
                                        ></div>
                                    </div>

                                    <button 
                                        className={`btn w-100 fw-bold ${
                                            level.status === 'final' ? 'btn-outline-success' : 
                                            level.status === 'locked' ? 'btn-light disabled' : 'btn-primary'
                                        }`}
                                        onClick={() => navigate(`/sekolah/levels/${level.id}`)}
                                        disabled={level.status === 'locked'}
                                    >
                                        {level.status === 'final' ? 'Lihat Jawaban' : 
                                         level.status === 'locked' ? 'Terkunci' : 'Kerjakan Level'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssessmentPage;
