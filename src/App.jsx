import { AuthProvider, useAuth } from "./context/AuthContext";
import { UKSProvider } from "./context/UKSContext";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import Toast from "./components/Toast";

function AppRouter() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;
  if (user.role === "admin") return <AdminPage />;
  return <UserPage />;
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
