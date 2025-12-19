import { useAuth } from '../context/AuthContext';
import AuthRequired from './AuthRequired';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  
  return isLoggedIn ? children : <AuthRequired />;
}