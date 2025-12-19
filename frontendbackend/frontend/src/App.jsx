import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import { auth } from './utils/auth';
import { api } from './utils/api';
import { useEffect } from 'react';
import './App.css';

// Components
import NavBar from './components/NavBar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Wallet from './pages/Wallet';
import History from './pages/History';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children }) => {
  const [state] = useStore();
  return state.user ? children : <Login />;
};

const AdminRoute = ({ children }) => {
  const [state] = useStore();
  if (!state.user) return <Login />;
  if (state.user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  return children;
};

export default function App() {
  const [state, setState] = useStore();

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setState({ user, wallet: user.wallet || { balance: user.role === 'admin' ? 10000 : 100 } });
    }
    
    // Load plans from API
    api.getPlans().then(plans => {
      setState({ plans: plans || [] });
    }).catch(() => {
      setState({ plans: [] });
    });
  }, []);

  return (
    <Router>
      <div className={`min-h-screen ${state.theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {state.user && <NavBar />}
        <main className={state.user ? 'container mx-auto px-4 py-8' : ''}>
          <Routes>
            <Route path="/" element={state.user ? <Dashboard /> : <Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
