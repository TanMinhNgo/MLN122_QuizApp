import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<{ accessToken: string }>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newToken = refreshResponse.data.accessToken;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("accessToken", newToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("accessToken");
          window.location.href = "/dang-nhap";
        }
      }
    }

    return Promise.reject(error);
  },
);

export { api };
