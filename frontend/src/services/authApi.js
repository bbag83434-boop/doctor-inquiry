import { apiClient, setAccessToken } from './apiClient.js';

function saveAccessToken(response) {
  const session = response.data.data;
  setAccessToken(session.accessToken);
  return session;
}

export async function registerAccount(payload) {
  const response = await apiClient.post('/auth/register', payload);
  return saveAccessToken(response);
}

export async function loginWithMobile({ mobileNumber, password, rememberMe }) {
  const response = await apiClient.post('/auth/login', { mobileNumber, password, rememberMe });
  return saveAccessToken(response);
}

export async function refreshAuthentication() {
  const response = await apiClient.post('/auth/refresh');
  return saveAccessToken(response);
}

export async function getCurrentAuthenticatedUser() {
  const response = await apiClient.get('/auth/me');
  return response.data.data.user;
}

export async function logoutFromApi() {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    setAccessToken(null);
  }
}
