import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ApiService from '../services/api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('user');
  const { login } = useAuth();
  const { themeConfig } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = { 
        name, 
        email, 
        password,           // needed by backend User model
        role: userType 
      };
      
      // Save user to MongoDB via backend API
      await ApiService.createUser(userData);
      
      // Do NOT log in directly; redirect to sign-in page
      alert('Account created successfully. Please sign in.');
      navigate('/login');
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-[calc(100vh-80px)] ${themeConfig.bg} w-full p-4`}>
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className={`${themeConfig.cardBg} ${themeConfig.border} p-8 rounded-lg shadow-lg border`}>
          <div className="text-center mb-8">
            <img src="/logo.png" alt="RechargeApp Logo" className="w-16 h-16 rounded-lg mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${themeConfig.text}`}>Create Account</h2>
            <p className={`${themeConfig.textSecondary} mt-2`}>Join us today</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 ${themeConfig.border} border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${themeConfig.cardBg} ${themeConfig.text}`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>Account Type</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className={`w-full p-3 ${themeConfig.border} border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${themeConfig.cardBg} ${themeConfig.text}`}
              >
                <option value="user">User Account</option>
                <option value="admin">Admin Account</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 ${themeConfig.border} border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${themeConfig.cardBg} ${themeConfig.text}`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 ${themeConfig.border} border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${themeConfig.cardBg} ${themeConfig.text}`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 ${themeConfig.border} border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${themeConfig.cardBg} ${themeConfig.text}`}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Create Account'}
          </button>
          
          <p className={`mt-6 text-center ${themeConfig.textSecondary}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
