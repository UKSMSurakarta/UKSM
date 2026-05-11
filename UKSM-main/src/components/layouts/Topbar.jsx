import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotifDropdown from '../NotifDropdown';

const Topbar = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === 'dashboard') return 'Dashboard Overview';
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2 px-3 sticky-top shadow-sm">
            <div className="container-fluid p-0">
                <button 
                    className="btn btn-light d-lg-none me-3" 
                    type="button" 
                    onClick={onToggleSidebar}
                >
                    <i className="bi bi-list fs-4"></i>
                </button>

                <div className="navbar-brand d-none d-lg-block">
                    <h5 className="m-0 fw-bold text-dark">{getPageTitle()}</h5>
                    <small className="text-muted small">Selamat datang kembali, {user?.name}</small>
                </div>

                <div className="ms-auto d-flex align-items-center">
                    <NotifDropdown />

                    <div className="dropdown">
                        <button className="btn btn-light d-flex align-items-center rounded-pill p-1 pe-3" type="button" data-bs-toggle="dropdown">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" width="32" height="32" className="rounded-circle me-2" />
                            <span className="d-none d-md-inline fw-medium small">Akun Saya</span>
                            <i className="bi bi-chevron-down ms-2 small"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                            <li><button className="dropdown-item py-2 text-danger" onClick={() => logout()}><i className="bi bi-box-arrow-right me-2"></i> Keluar</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Topbar;
