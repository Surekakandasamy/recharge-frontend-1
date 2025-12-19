import { createContext, useContext, useState } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(5000);

  const login = async (userData) => {
    const userWithSession = {
      ...userData,
      loginTime: new Date().toISOString(),
      sessionId: `SESSION_${Date.now()}`
    };
    
    setUser(userWithSession);
    setIsLoggedIn(true);
    setBalance(userData.role === 'admin' ? 0 : 5000);
    
    // Update user session in API
    if (userData.role !== 'admin') {
      try {
        await ApiService.updateUserSession(userWithSession);
      } catch (error) {
        console.error('Failed to update user session:', error);
      }
    }
    
    // Trigger loading of user transactions
    window.dispatchEvent(new CustomEvent('userLoggedIn', { 
      detail: { email: userData.email, role: userData.role } 
    }));
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const logout = async () => {
    if (user && user.role !== 'admin') {
      try {
        await ApiService.updateUserSession({
          ...user,
          logoutTime: new Date().toISOString(),
          sessionStatus: 'completed'
        });
      } catch (error) {
        console.error('Failed to update logout session:', error);
      }
    }
    
    setUser(null);
    setIsLoggedIn(false);
    setBalance(0);
  };

  const deductBalance = (amount) => {
    setBalance(prev => prev - amount);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, balance, login, logout, deductBalance, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;