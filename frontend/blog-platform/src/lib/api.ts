import { fetcher } from './fetcher';

export const api = {
  // GET request
  get: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return fetcher.get<T>(`${endpoint}${queryString}`);
  },

  // POST request
  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    return fetcher.post<T>(endpoint, data);
  },

  // PATCH request
  patch: async <T>(endpoint: string, data?: any): Promise<T> => {
    return fetcher.patch<T>(endpoint, data);
  },

  // DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    return fetcher.delete<T>(endpoint);
  },
};