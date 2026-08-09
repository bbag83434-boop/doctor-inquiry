import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { configureAuthRefresh, setAccessToken } from '../services/apiClient.js';
import { authenticationService } from '../services/authenticationService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const establishSession = useCallback(async (nextSession, rememberMe = false) => {
    setAccessToken(nextSession.accessToken);
    if (rememberMe) {
      localStorage.setItem('accessToken', nextSession.accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    const user = await authenticationService.getCurrentUser();
    const resolvedSession = { ...nextSession, user };
    setSession(resolvedSession);
    return resolvedSession;
  }, []);

  const login = useCallback(async ({ mobileNumber, password, rememberMe }) => {
    const nextSession = await authenticationService.login({ mobileNumber, password, rememberMe });
    return establishSession(nextSession, rememberMe);
  }, [establishSession]);

  const logout = useCallback(async () => {
    try {
      await authenticationService.logout();
    } finally {
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      setSession(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const nextSession = await authenticationService.refresh();
    return establishSession(nextSession, Boolean(localStorage.getItem('accessToken')));
  }, [establishSession]);

  const getCurrentUser = useCallback(async () => {
    const user = await authenticationService.getCurrentUser();
    setSession((current) => current ? { ...current, user } : current);
    return user;
  }, []);

  useEffect(() => {
    configureAuthRefresh(refreshSession);
    
    const init = async () => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
            try {
                const user = await getCurrentUser();
                setSession({ accessToken: storedToken, user });
                setIsLoading(false);
                return;
            } catch (e) {
                // Token invalid, clear it
                localStorage.removeItem('accessToken');
                setAccessToken(null);
            }
        }
        
        // No token or token invalid, try to refresh
        try {
            const nextSession = await refreshSession();
            setSession(nextSession);
        } catch (e) {
            setSession(null);
        }
        setIsLoading(false);
    };

    init();
    return () => configureAuthRefresh(null);
  }, [refreshSession, getCurrentUser]);

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
