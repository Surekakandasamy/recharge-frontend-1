import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AuthRequired() {
  const { themeConfig } = useTheme();
  
  return (
    <div className={`min-h-[calc(100vh-80px)] ${themeConfig.bg} flex items-center justify-center p-6`}>
      <div className={`${themeConfig.cardBg} ${themeConfig.border} border p-8 rounded-lg shadow-lg text-center max-w-md`}>
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">🔐</span>
        </div>
        <h2 className={`text-2xl font-bold mb-4 ${themeConfig.text}`}>Authentication Required</h2>
        <p className={`${themeConfig.textSecondary} mb-6 leading-relaxed`}>
          Please sign in to access recharge plans and services. Create an account if you don't have one.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/login" 
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className={`px-6 py-2 ${themeConfig.secondary} ${themeConfig.text} rounded-md font-medium transition-colors`}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}