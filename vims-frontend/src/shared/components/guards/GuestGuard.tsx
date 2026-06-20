import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

// Halaman guest (login) — jika sudah login redirect ke dashboard
export function GuestGuard() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <Outlet />;
}