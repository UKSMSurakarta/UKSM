import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import StatCard from '../../components/StatCard';
// Note: User needs to install recharts: npm install recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const SuperadminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [monitoring, setMonitoring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ jenjang: '', status: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, monitorRes] = await Promise.all([
                    axiosInstance.get('/superadmin/dashboard'),
                    axiosInstance.get('/superadmin/monitoring')
                ]);
                setStats(statsRes.data.data);
                setMonitoring(monitorRes.data.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

    const filteredData = monitoring.filter(s => {
        return (filters.jenjang === '' || s.jenjang === filters.jenjang) &&
               (filters.status === '' || s.status === filters.status);
    });

    return (
        <div className="container mt-2">
            <h4 className="fw-bold mb-4">Dashboard Analitik</h4>
            
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <StatCard title="Total Sekolah" value={stats?.summary.total_sekolah} icon="mortarboard" color="primary" />
                </div>
                <div className="col-md-3">
                    <StatCard title="Sudah Mengisi" value={`${stats?.summary.persentase_mengisi}%`} icon="patch-check" color="success" subtitle="Dari total seluruh sekolah" />
                </div>
                <div className="col-md-3">
                    <StatCard title="Total OPD" value={stats?.summary.total_opd} icon="building" color="info" />
                </div>
                <div className="col-md-3">
                    <StatCard title="Periode Aktif" value={stats?.summary.active_period} icon="calendar-check" color="warning" />
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-4">Status Assessment Sekolah</h6>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={stats?.chart_status}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h6 className="fw-bold mb-4">Distribusi Per Jenjang</h6>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={stats?.chart_jenjang} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {stats?.chart_jenjang.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold m-0">Monitoring Progress Sekolah</h6>
                    <div className="d-flex gap-2">
                        <select className="form-select form-select-sm" onChange={(e) => setFilters({...filters, jenjang: e.target.value})}>
                            <option value="">Semua Jenjang</option>
                            <option value="TK">TK</option>
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>
                            <option value="SMA">SMA</option>
                        </select>
                        <select className="form-select form-select-sm" onChange={(e) => setFilters({...filters, status: e.target.value})}>
                            <option value="">Semua Status</option>
                            <option value="Belum Mulai">Belum Mulai</option>
                            <option value="draft">Draft</option>
                            <option value="final">Final</option>
                        </select>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="small text-muted">
                                    <th className="px-4 py-3">NAMA SEKOLAH</th>
                                    <th>JENJANG</th>
                                    <th>OPD</th>
                                    <th>PROGRES</th>
                                    <th>STATUS</th>
                                    <th className="text-center">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(s => (
                                    <tr key={s.id}>
                                        <td className="px-4 fw-medium">{s.nama}</td>
                                        <td><span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">{s.jenjang}</span></td>
                                        <td className="small text-muted">{s.opd}</td>
                                        <td style={{ width: '150px' }}>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div className="progress-bar bg-primary" style={{ width: `${s.progress}%` }}></div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 ${s.status === 'final' ? 'bg-success' : s.status === 'draft' ? 'bg-warning' : 'bg-light text-muted border'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-light border">Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperadminDashboard;
