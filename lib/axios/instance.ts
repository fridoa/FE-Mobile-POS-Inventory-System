import environment from "@/configs/environtment";
import endpoint from "@/services/endpoint.constant";
import { getToken, setTokens } from "@/utils/auth";
import axios from "axios";

let logoutCallback: (() => void) | null = null;

export const setupAxiosInterceptors = (onLogout: () => void) => {
  logoutCallback = onLogout;
};

const instance = axios.create({
  baseURL: environment.API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;
    const errorMessage = error.response?.data?.meta?.message;

    const isTokenError = status === 401 || (status === 500 && errorMessage === "Invalid or expired token");

    if (!isTokenError || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return instance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getToken("refresh");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(`${environment.API_URL}${endpoint.AUTH}/refresh-token`, {
        refreshToken: refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

      await setTokens(newAccessToken, newRefreshToken || refreshToken);

      instance.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;
      originalRequest.headers.Authorization = "Bearer " + newAccessToken;

      processQueue(null, newAccessToken);
      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      if (logoutCallback) logoutCallback();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
