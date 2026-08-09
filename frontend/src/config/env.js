const fallbackBaseUrl = 'http://localhost:5000/api/v1';
const fallbackTimeoutMs = 10000;
const renderUrl = 'https://doctor-inquiry.onrender.com';

export const apiConfig = Object.freeze({
  baseURL: (import.meta.env.VITE_API_BASE_URL === '/api' ? renderUrl : import.meta.env.VITE_API_BASE_URL) ?? fallbackBaseUrl,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? fallbackTimeoutMs),
});
