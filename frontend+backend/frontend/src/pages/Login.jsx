import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { auth } from '../utils/auth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'user' });
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isRegister) {
      if (!form.name) {
        setError('Name is required for registration');
        return;
      }
      try {
        const user = await auth.register(form);
        // After successful signup, ask user to sign in instead of direct login
        console.log('Registered user:', user);
        setIsRegister(false);
        setForm({ ...form, password: '' });
        alert('Account created successfully. Please sign in.');
      } catch (err) {
        setError(err.message);
      }
    } else {
      const user = await auth.login(form.email, form.password);
      if (user) {
        setState({ user, wallet: user.wallet });
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    }
  };

  const toggleTheme = () => {
    setState({ theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="absolute top-4 right-4">
        <button onClick={toggleTheme} className={`p-2 rounded-lg ${state.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
          {state.theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      
      <div className="max-w-md w-full mx-4">
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-2xl`}>
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>RechargeApp</h2>
            <p className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              {isRegister ? 'Create your account' : 'Welcome back'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  required
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="user">User Account</option>
                  <option value="admin">Admin Account</option>
                </select>
              </>
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full p-4 pr-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${state.theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg font-semibold transition-colors">
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className={`${state.theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} font-medium`}
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
          

        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className={`${state.theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}