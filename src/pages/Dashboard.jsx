import { useStore } from '../hooks/useStore';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [state] = useStore();
  const transactions = state.transactions || [];
  const recentTransactions = transactions.slice(-5);
  const totalSpent = transactions.filter(tx => tx.type !== 'topup').reduce((sum, tx) => sum + tx.amount, 0);
  const successRate = transactions.length > 0 
    ? Math.round((transactions.filter(tx => tx.status === 'success').length / transactions.length) * 100)
    : 0;

  const quickActions = [
    { icon: 'RCH', title: 'Quick Recharge', desc: 'Recharge your mobile instantly', link: '/plans', color: 'bg-red-500' },
    { icon: 'ADD', title: 'Add Money', desc: 'Top up your wallet', link: '/wallet', color: 'bg-green-500' },
    { icon: 'HST', title: 'View History', desc: 'Check transaction history', link: '/history', color: 'bg-blue-500' },
    ...(state.user?.role === 'admin' ? [{ icon: 'ADM', title: 'Admin Panel', desc: 'Manage users and plans', link: '/admin', color: 'bg-purple-500' }] : []),
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {state.user?.name}!
            {state.user?.role === 'admin' && (
              <span className="ml-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Admin
              </span>
            )}
          </h1>
          <p className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            {state.user?.role === 'admin' ? 'Admin Dashboard Overview' : 'Here\'s your account overview'}
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Wallet Balance</h3>
              <p className="text-3xl font-bold text-green-600">₹{state.wallet.balance}</p>
              <Link to="/wallet" className="text-red-600 text-sm hover:underline mt-2 inline-block">
                Top up wallet →
              </Link>
            </div>
            <div className="text-sm font-bold bg-green-100 text-green-600 px-2 py-1 rounded">WALLET</div>
          </div>
        </div>
        
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Recharges</h3>
              <p className="text-3xl font-bold text-blue-600">{transactions.filter(tx => tx.type !== 'topup').length}</p>
              <Link to="/history" className="text-red-600 text-sm hover:underline mt-2 inline-block">
                View history →
              </Link>
            </div>
            <div className="text-sm font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded">TOTAL</div>
          </div>
        </div>
        
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Spent</h3>
              <p className="text-3xl font-bold text-red-600">₹{totalSpent}</p>
              <p className="text-sm text-gray-500 mt-2">This month</p>
            </div>
            <div className="text-sm font-bold bg-red-100 text-red-600 px-2 py-1 rounded">SPENT</div>
          </div>
        </div>
        
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Success Rate</h3>
              <p className="text-3xl font-bold text-green-600">{successRate}%</p>
              <p className="text-sm text-gray-500 mt-2">All time</p>
            </div>
            <div className="text-sm font-bold bg-green-100 text-green-600 px-2 py-1 rounded">SUCCESS</div>
          </div>
        </div>
      </div>

      {/* Admin Panel Access */}
      {state.user?.role === 'admin' && (
        <div className={`${state.theme === 'dark' ? 'bg-gradient-to-r from-purple-800 to-purple-700' : 'bg-gradient-to-r from-purple-600 to-purple-700'} p-6 rounded-xl shadow-lg text-white`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
              <p className="opacity-90">Manage users, plans, and view analytics</p>
            </div>
            <Link
              to="/admin"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <span className="text-xs font-bold bg-purple-100 text-purple-600 px-2 py-1 rounded">ADMIN</span>
              <span>Open Admin Panel</span>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`p-4 rounded-lg border-2 border-dashed ${state.theme === 'dark' ? 'border-gray-600 hover:border-red-500 hover:bg-gray-700' : 'border-gray-300 hover:border-red-500 hover:bg-red-50'} transition-all duration-200 group`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${action.color} p-3 rounded-lg text-white text-xs font-bold group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{action.title}</h3>
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h2>
          <Link to="/history" className="text-red-600 hover:text-red-700 font-medium">
            View All →
          </Link>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map(tx => (
              <div key={tx.id} className={`flex justify-between items-center p-4 ${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg text-xs font-bold ${tx.type === 'topup' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {tx.type === 'topup' ? 'TOP' : 'RCH'}
                  </div>
                  <div>
                    <p className={`font-medium ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {tx.type === 'topup' ? 'Wallet Top-up' : `${tx.operator} - ${tx.mobile}`}
                    </p>
                    <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'topup' ? 'text-green-600' : 'text-blue-600'}`}>
                    {tx.type === 'topup' ? '+' : ''}₹{tx.amount}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.status === 'success' ? 'bg-green-100 text-green-800' :
                    tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-2xl font-bold text-gray-400 mb-4">NO DATA</div>
            <p className={`text-xl ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No transactions yet</p>
            <p className={`${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-6`}>Start by recharging your mobile</p>
            <Link to="/plans" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Browse Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}