import { api } from "./instance";

api.interceptors.request.use(
  (config) => {
    // kalau nanti pakai Bearer Token, uncomment ini:
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("Forbidden");
    }

    if (status >= 500) {
      console.error("Server Error");
    }

    return Promise.reject(error);
  }
);