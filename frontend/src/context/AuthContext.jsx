import { createContext, useContext, useMemo, useState } from 'react';
import { loginWithMobile } from '../services/authApi.js';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'doctor-inquiry-auth';

function readStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const login = async ({ mobileNumber, password, rememberMe }) => {
    const nextSession = await loginWithMobile({ mobileNumber, password });
    setSession(nextSession);

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return nextSession;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  };

  const value = useMemo(() => ({
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
    user: session?.user ?? null,
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
