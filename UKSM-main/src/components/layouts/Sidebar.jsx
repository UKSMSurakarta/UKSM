import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isMobile, closeSidebar }) => {
    const { user, logout } = useAuth();

    const menuItems = {
        superadmin: [
            { path: '/superadmin/dashboard', icon: 'speedometer2', label: 'Dashboard' },
            { path: '/superadmin/opds', icon: 'building', label: 'Manajemen OPD' },
            { path: '/superadmin/sekolahs', icon: 'mortarboard', label: 'Manajemen Sekolah' },
            { path: '/superadmin/users', icon: 'people', label: 'Manajemen User' },
            { path: '/superadmin/levels', icon: 'journal-list', label: 'Bank Soal & Level' },
            { path: '/superadmin/periods', icon: 'calendar-range', label: 'Periode Assessment' },
            { path: '/superadmin/reports', icon: 'file-earmark-bar-graph', label: 'Laporan & Rekap' },
            { path: '/superadmin/content', icon: 'newspaper', label: 'Konten Website' },
            { path: '/superadmin/settings', icon: 'gear', label: 'Pengaturan' },
        ],
        admin: [
            { path: '/admin/dashboard', icon: 'speedometer2', label: 'Dashboard' },
            { path: '/admin/data-sekolah', icon: 'mortarboard', label: 'Data Sekolah' },
            { path: '/admin/monitoring', icon: 'display', label: 'Monitoring Assessment' },
            { path: '/admin/verification', icon: 'check-circle', label: 'Verifikasi Jawaban' },
            { path: '/admin/reports', icon: 'file-earmark-bar-graph', label: 'Laporan Wilayah' },
        ],
        user: [
            { path: '/user/dashboard', icon: 'speedometer2', label: 'Dashboard' },
            { path: '/user/news', icon: 'newspaper', label: 'Kelola Berita' },
            { path: '/user/announcements', icon: 'megaphone', label: 'Kelola Pengumuman' },
            { path: '/user/agendas', icon: 'calendar-event', label: 'Kelola Agenda' },
            { path: '/user/gallery', icon: 'images', label: 'Kelola Galeri' },
        ],
        sekolah: [
            { path: '/sekolah/dashboard', icon: 'speedometer2', label: 'Dashboard' },
            { path: '/sekolah/assessment', icon: 'clipboard-check', label: 'Assessment Saya' },
            { path: '/sekolah/progress', icon: 'graph-up-arrow', label: 'Progress Level' },
            { path: '/sekolah/profile', icon: 'person-vcard', label: 'Profil Sekolah' },
        ],
    };

    const roleMenu = menuItems[user?.role] || [];

    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin keluar?')) {
            logout();
        }
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-white h-100 sidebar-content shadow-sm">
            <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none text-primary">
                <i className="bi bi-heart-pulse-fill fs-3 me-2"></i>
                <span className="fs-4 fw-bold">Web UKS</span>
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {roleMenu.map((item, index) => (
                    <li key={index} className="nav-item">
                        <NavLink 
                            to={item.path} 
                            className={({ isActive }) => `nav-link d-flex align-items-center mb-1 ${isActive ? 'active shadow-sm' : 'text-dark'}`}
                            onClick={isMobile ? closeSidebar : undefined}
                        >
                            <i className={`bi bi-${item.icon} me-3 fs-5`}></i>
                            <span className="fw-medium">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
            <hr />
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle p-2 rounded hover-bg-light" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" width="32" height="32" className="rounded-circle me-2" />
                    <div className="text-truncate" style={{ maxWidth: '120px' }}>
                        <strong className="d-block small">{user?.name}</strong>
                        <span className="text-muted extra-small d-block text-capitalize">{user?.role}</span>
                    </div>
                </a>
                <ul className="dropdown-menu shadow border-0">
                    <li><Link className="dropdown-item" to="/profile">Profil Saya</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Keluar</button></li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
