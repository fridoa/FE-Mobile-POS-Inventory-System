import environment from "@/configs/environtment";
import endpoint from "@/services/endpoint.constant";
import { clearTokens, getToken, setTokens } from "@/utils/auth";
import axios from "axios";

const instance = axios.create({
  baseURL: environment.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

interface IFailedQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

let failedQueue: IFailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
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

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${environment.API_URL}${endpoint.AUTH}/refresh-token`, {
        refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

      await setTokens(newAccessToken, newRefreshToken);

      instance.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;

      originalRequest.headers.Authorization = "Bearer " + newAccessToken;

      processQueue(null, newAccessToken);

      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      await clearTokens();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
