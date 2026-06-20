import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function AuthGuard() {
  const { isAuthenticated, isLoading, hasFetched, fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, []);

  if (!hasFetched || isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}