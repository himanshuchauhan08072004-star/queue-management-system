import axios from "axios";

/**
 * Shared Axios instance. Attaches the JWT from localStorage to every
 * request and redirects to /login on a 401 response.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("qms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("qms_token");
      localStorage.removeItem("qms_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? "Something went wrong";
  }
  return "Something went wrong";
}
