import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BeritaDetailPage = () => {
    const { slug } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const apiBase = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiBase}/public/berita/${slug}`);
                setNews(response.data.data);
            } catch (error) {
                console.error('Error fetching news detail', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return <div className="container py-10 text-center"><div className="spinner-border text-primary"></div></div>;
    if (!news) return <div className="container py-10 text-center"><h5>Berita tidak ditemukan.</h5><Link to="/berita">Kembali ke Berita</Link></div>;

    return (
        <div className="bg-white py-5">
            <div className="container mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb small">
                        <li className="breadcrumb-item"><Link to="/">Beranda</Link></li>
                        <li className="breadcrumb-item"><Link to="/berita">Berita</Link></li>
                        <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }}>{news.judul}</li>
                    </ol>
                </nav>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <header className="mb-5">
                            <span className="badge bg-primary rounded-pill px-3 py-2 mb-3 text-capitalize">{news.tipe}</span>
                            <h1 className="display-5 fw-bold mb-3">{news.judul}</h1>
                            <div className="d-flex align-items-center text-muted small">
                                <span className="me-3"><i className="bi bi-person me-1"></i> {news.author.name}</span>
                                <span><i className="bi bi-calendar3 me-1"></i> {new Date(news.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </header>

                        <img 
                            src={news.thumbnail_url || 'https://via.placeholder.com/800x450?text=Web+UKS'} 
                            className="img-fluid rounded-4 shadow-sm mb-5 w-100" 
                            alt={news.judul}
                            style={{ maxHeight: '500px', objectFit: 'cover' }}
                        />

                        <div className="content lh-lg fs-5 text-dark mb-5" style={{ whiteSpace: 'pre-line' }}>
                            {news.isi}
                        </div>

                        <hr className="my-5 opacity-25" />
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to="/berita" className="btn btn-light rounded-pill px-4 fw-bold">
                                <i className="bi bi-arrow-left me-2"></i> Kembali ke Berita
                            </Link>
                            <div className="share">
                                <span className="small text-muted me-3">Bagikan:</span>
                                <button className="btn btn-sm btn-outline-primary rounded-circle me-2"><i className="bi bi-facebook"></i></button>
                                <button className="btn btn-sm btn-outline-primary rounded-circle"><i className="bi bi-twitter-x"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeritaDetailPage;
