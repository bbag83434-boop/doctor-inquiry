/** Centralised loading state for API work, lazy modules and route transitions. */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const GlobalLoadingContext = createContext(null);

export function GlobalLoadingProvider({ children }) {
  const [message, setMessage] = useState('Loading Doctor Inquiry...');
  const [pendingCount, setPendingCount] = useState(0);

  const beginLoading = useCallback((nextMessage) => {
    if (nextMessage) setMessage(nextMessage);
    setPendingCount((count) => count + 1);
    let finished = false;
    return () => {
      if (!finished) setPendingCount((count) => Math.max(0, count - 1));
      finished = true;
    };
  }, []);

  const value = useMemo(() => ({ isLoading: pendingCount > 0, message, beginLoading }), [beginLoading, message, pendingCount]);
  return <GlobalLoadingContext.Provider value={value}>{children}</GlobalLoadingContext.Provider>;
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  return context;
}
