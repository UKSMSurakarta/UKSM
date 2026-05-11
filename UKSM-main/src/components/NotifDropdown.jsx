import React, { useState, useEffect } from 'react';
import { getNotificationsApi, getUnreadCountApi, markAsReadApi, markAllAsReadApi } from '../api/verification';
import { Link } from 'react-router-dom';

const NotifDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await getUnreadCountApi();
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Failed to fetch unread count');
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await getNotificationsApi();
            setNotifications(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsReadApi(id);
            fetchUnreadCount();
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsReadApi();
            setUnreadCount(0);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read');
        }
    };

    return (
        <div className="dropdown">
            <button 
                className="btn btn-light rounded-circle position-relative p-2" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                onClick={fetchNotifications}
            >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 py-0 overflow-hidden" style={{ width: '320px', maxHeight: '450px' }}>
                <li className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <h6 className="m-0 fw-bold">Notifikasi</h6>
                    {unreadCount > 0 && (
                        <button className="btn btn-link p-0 extra-small text-decoration-none" onClick={handleMarkAllRead}>Tandai semua dibaca</button>
                    )}
                </li>
                <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                    {loading ? (
                        <div className="p-4 text-center"><div className="spinner-border spinner-border-sm text-primary"></div></div>
                    ) : notifications.length > 0 ? (
                        notifications.map(notif => (
                            <li key={notif.id} className={`p-3 border-bottom position-relative ${!notif.read_at ? 'bg-primary-subtle' : ''}`}>
                                <div className="d-flex" onClick={() => !notif.read_at && handleMarkAsRead(notif.id)}>
                                    <div className="flex-shrink-0 me-3">
                                        <div className={`rounded-circle p-2 ${notif.data.status === 'disetujui' ? 'bg-success' : 'bg-warning'} text-white`}>
                                            <i className={`bi bi-${notif.data.status === 'disetujui' ? 'check-lg' : 'exclamation-lg'}`}></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="mb-1 small">{notif.data.message}</p>
                                        <div className="extra-small text-muted">{new Date(notif.created_at).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-muted small">Tidak ada notifikasi baru.</li>
                    )}
                </div>
                <li className="p-2 text-center bg-light border-top">
                    <Link to="/notifications" className="extra-small text-decoration-none text-primary fw-bold">Lihat Semua Notifikasi</Link>
                </li>
            </ul>
            
            <style>{`
                .extra-small { font-size: 0.75rem; }
                .bg-primary-subtle { background-color: #f0f7ff !important; }
            `}</style>
        </div>
    );
};

export default NotifDropdown;
