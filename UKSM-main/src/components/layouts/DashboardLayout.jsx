import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar Desktop */}
            <div className="d-none d-lg-block border-end" style={{ width: '280px', minHeight: '100vh' }}>
                <Sidebar />
            </div>

            {/* Sidebar Mobile (Offcanvas) */}
            {sidebarOpen && (
                <div 
                    className="offcanvas offcanvas-start show d-lg-none" 
                    tabIndex="-1" 
                    style={{ visibility: 'visible', width: '280px' }}
                >
                    <div className="offcanvas-header bg-white border-bottom py-3">
                        <h5 className="offcanvas-title fw-bold text-primary">
                            <i className="bi bi-heart-pulse-fill me-2"></i>Web UKS
                        </h5>
                        <button type="button" className="btn-close" onClick={toggleSidebar}></button>
                    </div>
                    <div className="offcanvas-body p-0">
                        <Sidebar isMobile={true} closeSidebar={toggleSidebar} />
                    </div>
                </div>
            )}
            {sidebarOpen && <div className="offcanvas-backdrop fade show d-lg-none" onClick={toggleSidebar}></div>}

            {/* Main Content Area */}
            <div className="flex-fill d-flex flex-column" style={{ minWidth: 0 }}>
                <Topbar onToggleSidebar={toggleSidebar} />
                <main className="p-3 p-md-4 flex-fill overflow-auto">
                    <Outlet />
                </main>
                <footer className="bg-white border-top py-3 px-4 text-center text-muted small">
                    &copy; {new Date().getFullYear()} Web UKS - Sistem Informasi Kesehatan Sekolah. All rights reserved.
                </footer>
            </div>

            <style>{`
                .sidebar-content {
                    min-height: 100vh;
                }
                .nav-link.active {
                    background-color: #0d6efd !important;
                    color: white !important;
                }
                .hover-bg-light:hover {
                    background-color: #f8f9fa;
                }
                .extra-small {
                    font-size: 0.75rem;
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
