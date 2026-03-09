import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  });
  failedQueue = [];
}

// Response interceptor to handle errors with token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${token}` };
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${baseURL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        processQueue(null, data.access_token);
        originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${data.access_token}` };
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const fetcher = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

export default axiosInstance;