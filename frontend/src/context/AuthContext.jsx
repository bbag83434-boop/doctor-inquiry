import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { configureAuthRefresh, setAccessToken } from '../services/apiClient.js';
import { authenticationService } from '../services/authenticationService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const establishSession = useCallback(async (nextSession) => {
    setAccessToken(nextSession.accessToken);
    const user = await authenticationService.getCurrentUser();
    const resolvedSession = { ...nextSession, user };
    setSession(resolvedSession);
    return resolvedSession;
  }, []);

  const login = useCallback(async ({ mobileNumber, password, rememberMe }) => {
    const nextSession = await authenticationService.login({ mobileNumber, password, rememberMe });
    return establishSession(nextSession);
  }, [establishSession]);

  const logout = useCallback(async () => {
    try {
      await authenticationService.logout();
    } finally {
      setAccessToken(null);
      setSession(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const nextSession = await authenticationService.refresh();
    return establishSession(nextSession);
  }, [establishSession]);

  const getCurrentUser = useCallback(async () => {
    const user = await authenticationService.getCurrentUser();
    setSession((current) => current ? { ...current, user } : current);
    return user;
  }, []);

  useEffect(() => {
    configureAuthRefresh(refreshSession);
    refreshSession().catch(() => { setAccessToken(null); setSession(null); }).finally(() => setIsLoading(false));
    return () => configureAuthRefresh(null);
  }, [refreshSession]);

  const value = useMemo(() => ({
    isAuthenticated: Boolean(session?.accessToken && session?.user),
    isLoading,
    login,
    logout,
    refreshSession,
    getCurrentUser,
    user: session?.user ?? null,
  }), [session, isLoading, login, logout, refreshSession, getCurrentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
