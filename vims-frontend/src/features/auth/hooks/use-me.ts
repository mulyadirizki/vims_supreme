import { useEffect } from "react";
import { getMe } from "../api/me";
import { useAuthStore } from "../store/auth.store";

export const useMe = () => {
  const { setAuth, clearAuth, isLoading } = useAuthStore();

  useEffect(() => {
    getMe()
      .then(({ data }) => setAuth(data.user, data.sidebar))
      .catch(() => clearAuth());
  }, []);

  return { isLoading };
};