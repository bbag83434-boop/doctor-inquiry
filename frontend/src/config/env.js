const fallbackBaseUrl = 'http://localhost:5000/api/v1';
const fallbackTimeoutMs = 10000;
const renderUrl = 'https://doctor-inquiry.onrender.com';

function normalizeBaseUrl(url) {
  let baseUrl = url;
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (!baseUrl.endsWith('/api/v1')) {
    baseUrl = `${baseUrl}/api/v1`;
  }
  return baseUrl;
}

export const apiConfig = Object.freeze({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL === '/api' ? renderUrl : (import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl)),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? fallbackTimeoutMs),
});
