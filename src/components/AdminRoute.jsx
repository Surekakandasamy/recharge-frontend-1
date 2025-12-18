import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}