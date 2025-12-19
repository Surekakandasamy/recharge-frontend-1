import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { themeConfig } = useTheme();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = isLoggedIn ? [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/plans', label: 'Recharge Plans', icon: '📱' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/help', label: 'Help', icon: '❓' }
  ] : [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/plans', label: 'Recharge Plans', icon: '📱' },
    { path: '/login', label: 'Login', icon: '🔐' },
    { path: '/signup', label: 'Signup', icon: '📝' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={`fixed left-0 top-0 h-full w-64 ${themeConfig.cardBg} ${themeConfig.border} border-r transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${themeConfig.text}`}>Menu</h2>
            <button 
              onClick={onClose}
              className={`lg:hidden p-2 rounded-lg ${themeConfig.textSecondary} hover:${themeConfig.text}`}
            >
              ✕
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : `${themeConfig.text} hover:bg-blue-100 dark:hover:bg-blue-900`
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}