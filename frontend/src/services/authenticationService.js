import { getCurrentAuthenticatedUser, loginWithMobile, logoutFromApi, refreshAuthentication, registerAccount } from './authApi.js';

export const authenticationService = {
  login: loginWithMobile,
  logout: logoutFromApi,
  register: registerAccount,
  refresh: refreshAuthentication,
  getCurrentUser: getCurrentAuthenticatedUser,
};
