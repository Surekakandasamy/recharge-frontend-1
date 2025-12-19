import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { auth } from '../utils/auth';

export default function NavBar() {
  const [state, setState] = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    setState({ user: null, wallet: { balance: 0 } });
    navigate('/');
  };

  const toggleTheme = () => {
    setState({ theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <nav className={`${state.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg border-b`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold text-red-600">RechargeApp</Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className={`${state.theme === 'dark' ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'} transition-colors`}>Dashboard</Link>
            <Link to="/plans" className={`${state.theme === 'dark' ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'} transition-colors`}>Plans</Link>
            <Link to="/wallet" className={`${state.theme === 'dark' ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'} transition-colors`}>Wallet (₹{state.wallet?.balance || 0})</Link>
            <Link to="/history" className={`${state.theme === 'dark' ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'} transition-colors`}>History</Link>
            {state.user?.role === 'admin' && (
              <Link to="/admin" className={`${state.theme === 'dark' ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'} transition-colors font-semibold`}>Admin Panel</Link>
            )}
            
            <button onClick={toggleTheme} className={`p-2 rounded-lg ${state.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors text-sm`}>
              {state.theme === 'light' ? 'Dark' : 'Light'}
            </button>
            
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Hi, {state.user?.name}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}