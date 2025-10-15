import axios from "axios";
import StorageService from "./storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 시 토큰 자동 주입
api.interceptors.request.use(
  (config) => {
    const token = StorageService.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// 401 응답 시 자동 로그아웃
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      StorageService.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
