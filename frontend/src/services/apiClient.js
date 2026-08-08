import axios from 'axios';
import { apiConfig } from '../config/env.js';
import { emitApiLoading } from './apiEvents.js';

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

let accessToken = null;
let refreshSessionHandler = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function configureAuthRefresh(handler) {
  refreshSessionHandler = handler;
}

apiClient.interceptors.request.use((config) => {
  emitApiLoading(true);
  if (accessToken && !config.headers.Authorization) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    emitApiLoading(false);
    return response;
  },
  async (error) => {
    emitApiLoading(false);
    const request = error.config;
    const isAuthRequest = request?.url?.includes('/auth/login') || request?.url?.includes('/auth/register') || request?.url?.includes('/auth/refresh');
    if (error.response?.status === 401 && request && !request._retry && !isAuthRequest && refreshSessionHandler) {
      request._retry = true;
      try {
        await refreshSessionHandler();
        return apiClient(request);
      } catch {
        // The original request returns a safe authentication error below.
      }
    }
    const message = error.response?.data?.error?.message ?? error.message ?? 'An unexpected API error occurred.';
    return Promise.reject(new Error(message, { cause: error }));
  },
);
