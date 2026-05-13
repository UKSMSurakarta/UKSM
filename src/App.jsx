import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UKSProvider } from "./context/UKSContext";
import Toast from "./components/Toast";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";

import DashboardLayout from "./components/layout/DashboardLayout";
import SekolahDashboard from "./pages/sekolah/SekolahDashboard";
import SekolahAssessment from "./pages/sekolah/sekolahAssessment";
import SekolahHasilPenilaian from "./pages/sekolah/sekolahHasilPenilaian";
import SekolahProfil from "./pages/sekolah/sekolahProfil";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVerifikasi from "./pages/admin/AdminVerifikasi";
import Adminlaporan from "./pages/admin/Adminlaporan";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
import SuperadminManajemenOPD from "./pages/superadmin/SuperadminManajemenOPD";
import SuperAdminSekolah from "./pages/superadmin/SuperAdminSekolah";
import SuperAdminusers from "./pages/superadmin/SuperAdminusers";
import SuperAdminassessment from "./pages/superadmin/SuperAdminassessment";
import SuperAdminperiode from "./pages/superadmin/SuperAdminperiode";
import SuperAdminlaporan from "./pages/superadmin/SuperAdminlaporan";
import SuperAdminkonten from "./pages/superadmin/SuperAdminkonten";
import SuperAdminkontenDesain from "./pages/superadmin/SuperAdminkontenDesain";

import KontenDashboard from "./pages/konten/KontenDashboard";
import KontenDesain from "./pages/konten/KontenDesain";
import KontenGaleriMedia from "./pages/konten/KontenGaleriMedia";

// Auth Guard Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // Simple check or default if role matches
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        {/* Sekolah Routes */}
        <Route element={<ProtectedRoute allowedRoles={['sekolah']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/sekolah/dashboard" element={<SekolahDashboard />} />
          <Route path="/sekolah/profil" element={<SekolahProfil />} /> {/* Placeholder */}
          <Route path="/sekolah/kuesioner" element={<SekolahAssessment />} /> {/* Placeholder */}
          <Route path="/sekolah/bukti" element={<SekolahDashboard />} /> {/* Placeholder */}
          <Route path="/sekolah/hasil" element={<SekolahHasilPenilaian />} /> {/* Placeholder */}
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verifikasi" element={<AdminVerifikasi />} /> {/* Placeholder */}
          <Route path="/admin/sekolah" element={<AdminDashboard />} /> {/* Placeholder */}
          <Route path="/admin/laporan" element={<Adminlaporan />} /> {/* Placeholder */}
        </Route>

        {/* Superadmin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['superadmin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} />
          <Route path="/superadmin/manajemen" element={<SuperadminManajemenOPD />} />
          <Route path="/superadmin/sekolah" element={<SuperAdminSekolah />} />
          <Route path="/superadmin/users" element={<SuperAdminusers />} />
          <Route path="/superadmin/assessment" element={<SuperAdminassessment />} />
          <Route path="/superadmin/periode" element={<SuperAdminperiode />} />
          <Route path="/superadmin/laporan" element={<SuperAdminlaporan />} />
          <Route path="/superadmin/konten" element={<SuperAdminkonten />} />
          <Route path="/superadmin/SuperAdminkontenDesain" element={<SuperAdminkontenDesain />} />
        </Route>

        {/* Konten Routes */}
        <Route element={<ProtectedRoute allowedRoles={['konten']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/konten/dashboard" element={<KontenDashboard />} />
          <Route path="/konten/desain" element={<KontenDesain />} /> {/* Placeholder */}
          <Route path="/konten/berita" element={<KontenDashboard />} /> {/* Placeholder */}
          <Route path="/konten/galeri" element={<KontenGaleriMedia />} /> {/* Placeholder */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <UKSProvider>
      <AuthProvider>
        <Toast />
        <AppRouter />
      </AuthProvider>
    </UKSProvider>
  );
}
