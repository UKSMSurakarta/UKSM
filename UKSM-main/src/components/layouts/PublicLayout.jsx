import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PublicLayout = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <i className="bi bi-heart-pulse-fill text-primary fs-3 me-2"></i>
                        <span className="fw-bold fs-4 text-dark">Web UKS</span>
                    </Link>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link px-3 fw-medium" to="/">Beranda</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link px-3 fw-medium" to="/berita">Berita</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link px-3 fw-medium" to="/ranking">Ranking Sekolah</Link>
                            </li>
                            <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                                {isAuthenticated ? (
                                    <Link className="btn btn-primary rounded-pill px-4" to={`/${user.role}/dashboard`}>
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link className="btn btn-outline-primary rounded-pill px-4" to="/login">
                                        Masuk
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-fill">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-heart-pulse-fill text-primary fs-2 me-2"></i>
                                <h4 className="fw-bold m-0">Web UKS</h4>
                            </div>
                            <p className="text-muted small">Sistem Informasi Usaha Kesehatan Sekolah (UKS) Terintegrasi untuk Monitoring dan Penilaian Kesehatan Sekolah Kabupaten.</p>
                            <div className="d-flex gap-3 mt-4">
                                <a href="#" className="text-white opacity-50 hover-opacity-100 fs-5"><i className="bi bi-facebook"></i></a>
                                <a href="#" className="text-white opacity-50 hover-opacity-100 fs-5"><i className="bi bi-instagram"></i></a>
                                <a href="#" className="text-white opacity-50 hover-opacity-100 fs-5"><i className="bi bi-youtube"></i></a>
                            </div>
                        </div>
                        <div className="col-lg-2 ms-lg-auto">
                            <h6 className="fw-bold mb-4">Tautan Cepat</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2"><Link to="/" className="text-decoration-none text-muted small">Beranda</Link></li>
                                <li className="mb-2"><Link to="/berita" className="text-decoration-none text-muted small">Berita & Artikel</Link></li>
                                <li className="mb-2"><Link to="/ranking" className="text-decoration-none text-muted small">Ranking Sekolah</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h6 className="fw-bold mb-4">Hubungi Kami</h6>
                            <ul className="list-unstyled text-muted small">
                                <li className="mb-2"><i className="bi bi-geo-alt me-2"></i> Jl. Merdeka No. 10, Kompleks Perkantoran Pemerintah</li>
                                <li className="mb-2"><i className="bi bi-envelope me-2"></i> info@kominfo.go.id</li>
                                <li className="mb-2"><i className="bi bi-telephone me-2"></i> (021) 1234-5678</li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-4 opacity-25" />
                    <div className="text-center text-muted extra-small">
                        &copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika. All rights reserved.
                    </div>
                </div>
            </footer>
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .hover-opacity-100:hover { opacity: 1 !important; transition: 0.3s; }
            `}</style>
        </div>
    );
};

export default PublicLayout;
