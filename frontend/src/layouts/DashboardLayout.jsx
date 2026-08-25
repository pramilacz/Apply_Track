import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast/ToastContext";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileNav from "../components/MobileNav/MobileNav";
import { Spinner } from "../components/Loading/Loading";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner label="Loading your account" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <div className="dashboard-shell">
      <Sidebar user={user} onLogout={handleLogout} />
      <MobileNav user={user} onLogout={handleLogout} />
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
