import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/login";
import { useAuthStore } from "../store/auth.store";

export const useLogin = () => {
  const navigate = useNavigate();
  const { resetFetch } = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      resetFetch();
      navigate("/portal/dashboard");
    },
  });
};