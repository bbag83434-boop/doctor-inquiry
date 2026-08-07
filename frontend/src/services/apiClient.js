import axios from 'axios';
import { apiConfig } from '../config/env.js';
import { emitApiLoading } from './apiEvents.js';

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  emitApiLoading(true);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    emitApiLoading(false);
    return response;
  },
  (error) => {
    emitApiLoading(false);
    const message = error.response?.data?.error?.message ?? error.message ?? 'An unexpected API error occurred.';
    return Promise.reject(new Error(message, { cause: error }));
  },
);
