import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}
