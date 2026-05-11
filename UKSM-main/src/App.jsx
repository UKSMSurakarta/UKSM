import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import SuperadminDashboard from './pages/superadmin/DashboardPage';
import UsersPage from './pages/superadmin/UsersPage';
import SekolahsPage from './pages/superadmin/SekolahsPage';
import OpdsPage from './pages/superadmin/OpdsPage';
import AdminDashboard from './pages/admin/DashboardPage';
import UserDashboard from './pages/user/Dashboard';
import KontenListPage from './pages/user/KontenListPage';
import KontenFormPage from './pages/user/KontenFormPage';
import VerifikasiPage from './pages/admin/VerifikasiPage';
import DetailVerifikasiPage from './pages/admin/DetailVerifikasiPage';
import AssessmentPage from './pages/sekolah/AssessmentPage';
import IsiLevelPage from './pages/sekolah/IsiLevelPage';
import SekolahDashboard from './pages/sekolah/Dashboard';

// Public Pages
import PublicLayout from './components/layouts/PublicLayout';
import HomePage from './pages/public/HomePage';
import BeritaPage from './pages/public/BeritaPage';
import BeritaDetailPage from './pages/public/BeritaDetailPage';
import RankingPage from './pages/public/RankingPage';

function App() {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/berita" element={<BeritaPage />} />
                    <Route path="/berita/:slug" element={<BeritaDetailPage />} />
                    <Route path="/ranking" element={<RankingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* Superadmin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} />
                        <Route path="/superadmin/users" element={<UsersPage />} />
                        <Route path="/superadmin/sekolahs" element={<SekolahsPage />} />
                        <Route path="/superadmin/opds" element={<OpdsPage />} />
                        <Route path="/superadmin/verifikasi" element={<VerifikasiPage />} />
                        <Route path="/superadmin/verifikasi/:sekolahId" element={<DetailVerifikasiPage />} />
                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/verifikasi" element={<VerifikasiPage />} />
                        <Route path="/admin/verifikasi/:sekolahId" element={<DetailVerifikasiPage />} />
                    </Route>
                </Route>

                {/* User Routes */}
                <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/user/dashboard" element={<UserDashboard />} />
                        <Route path="/user/kontens" element={<KontenListPage />} />
                        <Route path="/user/kontens/create" element={<KontenFormPage />} />
                        <Route path="/user/kontens/edit/:id" element={<KontenFormPage />} />
                    </Route>
                </Route>

                {/* Sekolah Routes */}
                <Route element={<ProtectedRoute allowedRoles={['sekolah']} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/sekolah/dashboard" element={<SekolahDashboard />} />
                        <Route path="/sekolah/assessment" element={<AssessmentPage />} />
                        <Route path="/sekolah/levels/:id" element={<IsiLevelPage />} />
                    </Route>
                </Route>

                {/* Error Pages */}
                <Route path="/unauthorized" element={<div className="container mt-5"><h1>403 - Unauthorized</h1></div>} />
                <Route path="*" element={<div className="container mt-5"><h1>404 - Not Found</h1></div>} />
            </Routes>
        </Router>
    );
}

export default App;
