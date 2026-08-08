import { Navigate } from 'react-router-dom';
import { GlobalLoader } from './GlobalLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <GlobalLoader message="Checking your secure session..." />;
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}
