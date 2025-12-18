import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ApiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PlanEditModal from '../components/PlanEditModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { themeConfig } = useTheme();

  useEffect(() => {
    loadData();
    
    // Listen for new transactions
    const handleNewTransaction = (event) => {
      console.log('Admin: New transaction detected:', event.detail);
      // Add transaction directly to state for immediate display
      setTransactions(prev => {
        const exists = prev.find(t => t.id === event.detail.id);
        if (exists) return prev;
        console.log('Admin: Adding new transaction to state');
        return [event.detail, ...prev];
      });
      // Also refresh from API after a short delay
      setTimeout(() => {
        console.log('Admin: Refreshing data from API');
        loadData();
      }, 2000);
    };
    
    window.addEventListener('transactionAdded', handleNewTransaction);
    
    // Auto-refresh every 30 seconds as backup
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => {
      window.removeEventListener('transactionAdded', handleNewTransaction);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Debug logging
    console.log('Admin Dashboard Data:', {
      plans: plans.length,
      users: users.length, 
      transactions: transactions.length,
      transactionDetails: transactions
    });
  }, [plans, users, transactions]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Admin: Loading data from API...');
      
      const [plansData, usersData, transactionsData, sessionsData] = await Promise.all([
        ApiService.fetchPlans(),
        ApiService.fetchUsers(), 
        ApiService.fetchTransactions(),
        ApiService.fetchUserSessions()
      ]);
      
      console.log('Admin: API Response:', {
        plans: plansData?.length || 0,
        users: usersData?.length || 0,
        transactions: transactionsData?.length || 0,
        sessions: sessionsData?.length || 0
      });
      
      // Only set real API data
      setPlans(plansData || []);
      setUsers(usersData || []);
      setTransactions(transactionsData || []);
      setUserSessions(sessionsData || []);
      
      console.log('Admin: Transactions set to state:', transactionsData?.length || 0, 'transactions');
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load some data from API' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSave = async (planData) => {
    setMessage({ type: '', text: '' });
    
    try {
      if (editingPlan) {
        await ApiService.updatePlan(editingPlan.id, planData);
        setMessage({ type: 'success', text: 'Plan updated successfully!' });
      } else {
        await ApiService.createPlan(planData);
        setMessage({ type: 'success', text: 'Plan created successfully!' });
      }
      await loadData();
      setShowModal(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      setMessage({ type: 'error', text: `Error saving plan: ${error.message}` });
      throw error;
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleDeletePlan = async (id) => {
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      setMessage({ type: '', text: '' });
      try {
        await ApiService.deletePlan(id);
        setMessage({ type: 'success', text: 'Plan deleted successfully!' });
        await loadData();
      } catch (error) {
        console.error('Error deleting plan:', error);
        setMessage({ type: 'error', text: `Error deleting plan: ${error.message}` });
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm('Delete this user?')) {
      try {
        await ApiService.deleteUser(id);
        loadData();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'plans', label: 'Plans', icon: '📋' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'transactions', label: 'Transactions', icon: '💳' }
  ];

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div className={`min-h-screen ${themeConfig.bg} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Admin Dashboard</h1>
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>🔄</span>
            )}
            Refresh Data
          </button>
        </div>
        
        {/* Tabs */}
        <div className={`${themeConfig.cardBg} rounded-lg border ${themeConfig.border} mb-6`}>
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : `${themeConfig.textSecondary} hover:${themeConfig.text}`
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
              <h3 className={`text-lg font-semibold ${themeConfig.text} mb-2`}>Total Plans</h3>
              <p className="text-3xl font-bold text-blue-600">{plans.length}</p>
            </div>
            <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
              <h3 className={`text-lg font-semibold ${themeConfig.text} mb-2`}>Total Users</h3>
              <p className="text-3xl font-bold text-green-600">{users.length}</p>
            </div>
            <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
              <h3 className={`text-lg font-semibold ${themeConfig.text} mb-2`}>Transactions</h3>
              <p className="text-3xl font-bold text-purple-600">{transactions.length}</p>
              <p className={`text-sm ${themeConfig.textSecondary} mt-1`}>Total Revenue: ₹{transactions.reduce((sum, t) => sum + (t.amount || 0), 0)}</p>
            </div>
            <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
              <h3 className={`text-lg font-semibold ${themeConfig.text} mb-2`}>User Sessions</h3>
              <p className="text-3xl font-bold text-orange-600">{userSessions.length}</p>
              <p className={`text-sm ${themeConfig.textSecondary} mt-1`}>Active & Completed</p>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${themeConfig.text}`}>Manage Plans</h2>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span>+</span>
                Add Plan
              </button>
            </div>

            {/* Success/Error Messages */}
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-100 border border-green-300 text-green-700' 
                  : 'bg-red-100 border border-red-300 text-red-700'
              }`}>
                {message.text}
              </div>
            )}



            <div className="grid gap-4">
              {plans.length === 0 ? (
                <div className={`${themeConfig.cardBg} p-8 rounded-lg border ${themeConfig.border} text-center`}>
                  <p className={themeConfig.textSecondary}>No plans found. Create your first plan!</p>
                </div>
              ) : (
                plans.map(plan => (
                  <div key={plan.id} className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border} hover:shadow-lg transition-shadow`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-bold ${themeConfig.text}`}>{plan.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            plan.category === 'unlimited' ? 'bg-blue-100 text-blue-800' :
                            plan.category === 'data' ? 'bg-green-100 text-green-800' :
                            plan.category === 'talktime' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {plan.category}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className={`text-sm ${themeConfig.textSecondary}`}>Price</p>
                            <p className={`font-semibold ${themeConfig.text}`}>₹{plan.price}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${themeConfig.textSecondary}`}>Data</p>
                            <p className={`font-semibold ${themeConfig.text}`}>{plan.data}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${themeConfig.textSecondary}`}>Validity</p>
                            <p className={`font-semibold ${themeConfig.text}`}>{plan.validity}</p>
                          </div>
                        </div>
                        <div>
                          <p className={`text-sm ${themeConfig.textSecondary} mb-1`}>Benefits:</p>
                          <p className={`text-sm ${themeConfig.text}`}>
                            {Array.isArray(plan.benefits) ? plan.benefits.join(', ') : plan.benefits || 'No benefits listed'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <PlanEditModal
              plan={editingPlan}
              isOpen={showModal}
              onClose={handleCloseModal}
              onSave={handlePlanSave}
            />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className={`text-2xl font-bold ${themeConfig.text} mb-6`}>User Management</h2>
            <div className="grid gap-4">
              {users.length === 0 ? (
                <div className={`${themeConfig.cardBg} p-8 rounded-lg border ${themeConfig.border} text-center`}>
                  <p className={themeConfig.textSecondary}>No users found.</p>
                </div>
              ) : (
                users.map(user => {
                  const userTransactions = transactions.filter(t => 
                    t.user === user.email || t.user === user.name
                  );
                  const totalSpent = userTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
                  
                  return (
                    <div key={user.id} className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border} hover:shadow-lg transition-shadow`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-bold ${themeConfig.text}`}>{user.name || user.email}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role || 'user'}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status || 'active'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className={`text-sm ${themeConfig.textSecondary}`}>Email</p>
                              <p className={`font-medium ${themeConfig.text} text-sm`}>{user.email}</p>
                            </div>
                            <div>
                              <p className={`text-sm ${themeConfig.textSecondary}`}>Total Spent</p>
                              <p className={`font-semibold ${themeConfig.text}`}>₹{totalSpent}</p>
                            </div>
                            <div>
                              <p className={`text-sm ${themeConfig.textSecondary}`}>Transactions</p>
                              <p className={`font-semibold ${themeConfig.text}`}>{userTransactions.length}</p>
                            </div>
                            <div>
                              <p className={`text-sm ${themeConfig.textSecondary}`}>Joined</p>
                              <p className={`font-medium ${themeConfig.text} text-sm`}>
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          {userTransactions.length > 0 && (
                            <div>
                              <p className={`text-sm ${themeConfig.textSecondary} mb-2`}>Recent Transactions:</p>
                              <div className="space-y-1">
                                {userTransactions.slice(0, 3).map(transaction => (
                                  <div key={transaction.id} className={`text-sm ${themeConfig.text} bg-gray-50 dark:bg-gray-800 p-2 rounded`}>
                                    ₹{transaction.amount} - {transaction.plan} ({transaction.date})
                                  </div>
                                ))}
                                {userTransactions.length > 3 && (
                                  <p className={`text-xs ${themeConfig.textSecondary}`}>+{userTransactions.length - 3} more transactions</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center gap-1"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${themeConfig.text}`}>Transaction History</h2>
              <div className={`text-sm ${themeConfig.textSecondary}`}>
                Total: {transactions.length} transactions
              </div>
            </div>
            
            {transactions.length === 0 ? (
              <div className={`${themeConfig.cardBg} p-8 rounded-lg border ${themeConfig.border} text-center`}>
                <p className={themeConfig.textSecondary}>No transactions found.</p>
                <p className={`text-sm ${themeConfig.textSecondary} mt-2`}>Transactions will appear here when users make recharges.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full ${themeConfig.cardBg} rounded-lg border ${themeConfig.border}`}>
                  <thead className={`bg-gray-50 dark:bg-gray-800`}>
                    <tr>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>Transaction ID</th>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>User</th>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>Phone Number</th>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>Plan</th>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>Amount</th>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>Date</th>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>Time</th>
                      <th className={`p-4 text-left ${themeConfig.text} font-semibold`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.id || index} className={`border-t ${themeConfig.border} hover:bg-gray-50 dark:hover:bg-gray-800`}>
                        <td className={`p-4 ${themeConfig.text} font-mono text-sm`}>
                          {transaction.id || `TXN${index + 1}`}
                        </td>
                        <td className={`p-4 ${themeConfig.text}`}>
                          <div>
                            <p className="font-medium">{transaction.userName || transaction.user || 'Unknown User'}</p>
                            <p className="text-xs text-gray-500">{transaction.userEmail || transaction.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className={`p-4 ${themeConfig.text} font-mono`}>
                          {transaction.phoneNumber || transaction.mobile || 'N/A'}
                        </td>
                        <td className={`p-4 ${themeConfig.text}`}>
                          <div>
                            <p className="font-medium">{transaction.plan || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{transaction.operator || 'N/A'}</p>
                          </div>
                        </td>
                        <td className={`p-4 ${themeConfig.text} font-semibold`}>
                          ₹{transaction.amount || 0}
                        </td>
                        <td className={`p-4 ${themeConfig.text}`}>
                          {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className={`p-4 ${themeConfig.text}`}>
                          {transaction.time || 'N/A'}
                        </td>
                        <td className={`p-4`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            (transaction.status || 'completed') === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {transaction.status || 'completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}