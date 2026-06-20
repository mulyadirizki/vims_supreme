import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/logout";
import { useAuthStore } from "../store/auth.store";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth, resetFetch } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      resetFetch();
      navigate("/login");
    },
    onError: () => {
      clearAuth();
      resetFetch();
      navigate("/login");
    },
  });
};