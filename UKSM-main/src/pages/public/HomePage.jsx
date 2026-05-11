import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
    const [stats, setStats] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const [statsRes, newsRes] = await Promise.all([
                    axios.get(`${apiBase}/public/statistik`),
                    axios.get(`${apiBase}/public/berita?limit=3`)
                ]);
                setStats(statsRes.data.data);
                setNews(newsRes.data.data);
            } catch (error) {
                console.error('Error fetching public data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5 py-lg-10 overflow-hidden position-relative" style={{ minHeight: '600px', display: 'flex', alignItems: 'center' }}>
                <div className="container position-relative z-1">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h1 className="display-3 fw-bold mb-3">Wujudkan Sekolah Sehat & Berprestasi</h1>
                            <p className="lead mb-4 opacity-75">Sistem Informasi Monitoring dan Penilaian Kesehatan Sekolah (UKS) untuk menciptakan lingkungan belajar yang optimal bagi masa depan generasi bangsa.</p>
                            <div className="d-flex gap-3">
                                <Link to="/login" className="btn btn-light btn-lg rounded-pill px-4 fw-bold text-primary">Mulai Assessment</Link>
                                <Link to="/berita" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold">Pelajari Lebih Lanjut</Link>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            <i className="bi bi-shield-check display-1 opacity-25" style={{ fontSize: '20rem' }}></i>
                        </div>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle" style={{ width: '500px', height: '500px', transform: 'translate(30%, -30%)' }}></div>
            </section>

            {/* Stats Section */}
            <section className="py-5 bg-light mt-n5 position-relative z-2">
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm text-center p-4">
                                <h2 className="fw-bold text-primary mb-1">{stats?.total_sekolah || '...'}</h2>
                                <p className="text-muted small mb-0 fw-medium">Sekolah Terdaftar</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm text-center p-4">
                                <h2 className="fw-bold text-success mb-1">{stats?.sekolah_final || '...'}</h2>
                                <p className="text-muted small mb-0 fw-medium">Selesai Assessment</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card border-0 shadow-sm text-center p-4">
                                <h2 className="fw-bold text-info mb-1">{stats?.total_berita || '...'}</h2>
                                <p className="text-muted small mb-0 fw-medium">Berita & Informasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-5 py-lg-7">
                <div className="container text-center mb-5">
                    <h2 className="fw-bold">Cara Penggunaan Sistem</h2>
                    <p className="text-muted">Proses penilaian UKS dilakukan secara mandiri oleh setiap sekolah.</p>
                </div>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4 text-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-4 d-inline-block mb-3">
                                <i className="bi bi-box-arrow-in-right text-primary fs-2"></i>
                            </div>
                            <h5 className="fw-bold">1. Login Akun</h5>
                            <p className="text-muted small px-lg-4">Masuk menggunakan akun operator sekolah yang telah didaftarkan oleh admin wilayah.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-4 d-inline-block mb-3">
                                <i className="bi bi-pencil-square text-primary fs-2"></i>
                            </div>
                            <h5 className="fw-bold">2. Isi Assessment</h5>
                            <p className="text-muted small px-lg-4">Jawab semua pertanyaan pada tiap level secara berurutan dan unggah bukti fisiknya.</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-4 d-inline-block mb-3">
                                <i className="bi bi-file-earmark-check text-primary fs-2"></i>
                            </div>
                            <h5 className="fw-bold">3. Submit Final</h5>
                            <p className="text-muted small px-lg-4">Setelah semua level selesai, lakukan submit final untuk mendapatkan penilaian skor akhir.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Preview */}
            <section className="py-5 py-lg-7 bg-light">
                <div className="container mb-5 d-flex justify-content-between align-items-end">
                    <div>
                        <h2 className="fw-bold m-0">Berita & Pengumuman</h2>
                        <p className="text-muted mb-0">Informasi terbaru seputar kegiatan UKS dan kesehatan sekolah.</p>
                    </div>
                    <Link to="/berita" className="btn btn-outline-primary rounded-pill px-4 fw-bold d-none d-md-block">Lihat Semua</Link>
                </div>
                <div className="container">
                    <div className="row g-4">
                        {loading ? (
                            <p className="text-center text-muted">Memuat berita...</p>
                        ) : news.map(item => (
                            <div key={item.id} className="col-md-4">
                                <div className="card border-0 shadow-sm h-100 overflow-hidden">
                                    <img 
                                        src={item.thumbnail_url || 'https://via.placeholder.com/400x250?text=Web+UKS'} 
                                        className="card-img-top" 
                                        alt={item.judul}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <div className="mb-2">
                                            <span className="badge bg-primary-subtle text-primary small text-capitalize">{item.tipe}</span>
                                            <small className="text-muted ms-2">{new Date(item.created_at).toLocaleDateString('id-ID')}</small>
                                        </div>
                                        <h5 className="card-title fw-bold mb-3">{item.judul}</h5>
                                        <p className="card-text text-muted small text-truncate-2">{item.isi.substring(0, 100)}...</p>
                                        <Link to={`/berita/${item.slug}`} className="btn btn-link p-0 text-decoration-none fw-bold small">Baca Selengkapnya <i className="bi bi-arrow-right"></i></Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5 d-md-none">
                        <Link to="/berita" className="btn btn-outline-primary rounded-pill px-4 fw-bold w-100">Lihat Semua Berita</Link>
                    </div>
                </div>
            </section>
            
            <style>{`
                .text-truncate-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .bg-primary-subtle { background-color: #e7f1ff; }
            `}</style>
        </div>
    );
};

export default HomePage;
