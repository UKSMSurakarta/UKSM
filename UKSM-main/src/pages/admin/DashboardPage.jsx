import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/admin/dashboard');
                setStats(response.data.data);
            } catch (error) {
                console.error('Error fetching admin stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-2">
            <h4 className="fw-bold mb-4">Dashboard Monitoring Wilayah</h4>
            
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <StatCard title="Sekolah Binaan" value={stats?.summary.total_sekolah} icon="mortarboard" color="primary" />
                </div>
                <div className="col-md-4">
                    <StatCard title="Sudah Mengisi" value={stats?.summary.sekolah_aktif} icon="check-circle" color="success" />
                </div>
                <div className="col-md-4">
                    <StatCard title="Belum Mulai" value={stats?.summary.belum_mengisi} icon="clock-history" color="warning" />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="fw-bold m-0">Progress Sekolah Wilayah Anda</h6>
                            <button className="btn btn-sm btn-outline-primary">Lihat Laporan Lengkap</button>
                        </div>
                        <div className="alert alert-info border-0 shadow-sm mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            Gunakan menu <strong>Monitoring Assessment</strong> untuk melihat detail jawaban per sekolah.
                        </div>
                        
                        <div className="mt-4">
                            {/* Placeholder for small monitoring list */}
                            <p className="text-muted small">Fitur tabel monitoring lengkap sedang dalam tahap sinkronisasi data...</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 py-3 px-4">
                            <h6 className="fw-bold m-0">Aktivitas Terbaru</h6>
                        </div>
                        <div className="card-body p-0">
                            {stats?.recent_notifications.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {stats.recent_notifications.map((notif, idx) => (
                                        <div key={idx} className="list-group-item p-3 border-0 border-bottom">
                                            <div className="d-flex align-items-start">
                                                <div className="bg-success rounded-circle p-1 me-2 mt-1"></div>
                                                <div>
                                                    <p className="mb-0 small fw-medium">{notif.message}</p>
                                                    <small className="text-muted extra-small">{notif.time}</small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted small">
                                    Tidak ada aktivitas submit final hari ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
