import { Navigate, useLocation } from 'react-router-dom';
import { GlobalLoader } from './GlobalLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <GlobalLoader message="Checking your secure session..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
