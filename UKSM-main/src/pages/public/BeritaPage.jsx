import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BeritaPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        fetchNews();
    }, [page]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiBase}/public/berita?page=${page}`);
            setNews(response.data.data);
            setMeta(response.data.meta);
        } catch (error) {
            console.error('Error fetching news', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light py-5 min-vh-100">
            <div className="container mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb small">
                        <li className="breadcrumb-item"><Link to="/">Beranda</Link></li>
                        <li className="breadcrumb-item active">Berita</li>
                    </ol>
                </nav>
                <h2 className="fw-bold m-0">Berita & Informasi UKS</h2>
                <p className="text-muted">Kumpulan kegiatan dan edukasi seputar kesehatan sekolah.</p>
            </div>

            <div className="container">
                {loading ? (
                    <div className="row g-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="col-md-4">
                                <div className="card border-0 shadow-sm h-100 placeholder-glow" style={{ height: '350px' }}>
                                    <div className="placeholder col-12" style={{ height: '200px' }}></div>
                                    <div className="card-body">
                                        <div className="placeholder col-8 mb-2"></div>
                                        <div className="placeholder col-12 mb-3 py-3"></div>
                                        <div className="placeholder col-6"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="row g-4 mb-5">
                            {news.map(item => (
                                <div key={item.id} className="col-md-4">
                                    <div className="card border-0 shadow-sm h-100 overflow-hidden">
                                        <img 
                                            src={item.thumbnail_url || 'https://via.placeholder.com/400x250?text=Web+UKS'} 
                                            className="card-img-top" 
                                            alt={item.judul}
                                            style={{ height: '220px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body">
                                            <div className="mb-2">
                                                <span className="badge bg-primary-subtle text-primary small text-capitalize">{item.tipe}</span>
                                                <small className="text-muted ms-2">{new Date(item.created_at).toLocaleDateString('id-ID')}</small>
                                            </div>
                                            <h5 className="card-title fw-bold mb-3">{item.judul}</h5>
                                            <p className="card-text text-muted small text-truncate-3">{item.isi.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
                                            <Link to={`/berita/${item.slug}`} className="btn btn-link p-0 text-decoration-none fw-bold small">Selengkapnya <i className="bi bi-arrow-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination placeholder */}
                        {meta && meta.last_page > 1 && (
                            <nav className="d-flex justify-content-center">
                                <ul className="pagination shadow-sm">
                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link py-2 px-3" onClick={() => setPage(page - 1)}>Sebelumnya</button>
                                    </li>
                                    <li className="page-item active"><span className="page-link py-2 px-3">{page}</span></li>
                                    <li className={`page-item ${page === meta.last_page ? 'disabled' : ''}`}>
                                        <button className="page-link py-2 px-3" onClick={() => setPage(page + 1)}>Berikutnya</button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>

            <style>{`
                .text-truncate-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .bg-primary-subtle { background-color: #e7f1ff; }
            `}</style>
        </div>
    );
};

export default BeritaPage;
