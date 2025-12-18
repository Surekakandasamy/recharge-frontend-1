import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { api } from '../utils/api';

const refreshPlans = async (setState) => {
  try {
    const plans = await api.getPlans();
    setState({ plans });
  } catch (error) {
    console.error('Failed to refresh plans:', error);
  }
};

export default function Admin() {
  const [state, setState] = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [newPlan, setNewPlan] = useState({ name: '', operator: '', price: '', data: '', validity: '', category: '', benefits: '' });
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendUsers, setBackendUsers] = useState([]);
  const [backendTransactions, setBackendTransactions] = useState([]);

  const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const transactions = backendTransactions.length ? backendTransactions : (state.transactions || []);
  const plans = state.plans || [];
  
  const totalRevenue = transactions.reduce((sum, tx) => tx.type !== 'topup' ? sum + tx.amount : sum, 0);

  // Load users from backend API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users');
        const data = await response.json();
        setBackendUsers(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to load users from API:', error);
        setBackendUsers([]);
      }
    };

    const loadTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/transactions');
        const data = await response.json();
        // data.data is array from backend with user and plan populated
        setBackendTransactions(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to load transactions from API:', error);
        setBackendTransactions([]);
      }
    };

    loadUsers();
    loadTransactions();
  }, []);

  // Analytics data
  const today = new Date().toDateString();
  const todayRecharges = transactions.filter(tx => 
    tx.type !== 'topup' && new Date(tx.date).toDateString() === today
  );

  const operatorStats = transactions
    .filter(tx => tx.type !== 'topup' && tx.status === 'success')
    .reduce((acc, tx) => {
      if (tx.operator) {
        acc[tx.operator] = (acc[tx.operator] || 0) + 1;
      }
      return acc;
    }, {});

  const dailyRecharges = transactions
    .filter(tx => tx.type !== 'topup')
    .reduce((acc, tx) => {
      const date = new Date(tx.date).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const handleAddPlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const plan = {
      name: newPlan.name,
      operator: newPlan.operator,
      price: parseFloat(newPlan.price),
      data: newPlan.data,
      validity: newPlan.validity,
      category: newPlan.category,
      benefits: newPlan.benefits,
      popular: false
    };
    
    try {
      const response = await fetch('http://localhost:5001/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      
      if (response.ok) {
        await refreshPlans(setState);
        setNewPlan({ name: '', operator: '', price: '', data: '', validity: '', category: '', benefits: '' });
        alert('Plan added successfully!');
      } else {
        alert('Failed to add plan');
      }
    } catch (error) {
      console.error('Error adding plan:', error);
      alert('Failed to add plan');
    }
    setLoading(false);
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updatedPlan = {
      ...editingPlan,
      price: parseFloat(editingPlan.price)
    };
    
    try {
      const response = await fetch(`http://localhost:5001/api/plans/${editingPlan._id || editingPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan)
      });
      
      if (response.ok) {
        await refreshPlans(setState);
        setEditingPlan(null);
        alert('Plan updated successfully!');
      } else {
        alert('Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan');
    }
    setLoading(false);
  };

  const handleDeletePlan = async (planId) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/plans/${planId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await refreshPlans(setState);
          alert('Plan deleted successfully!');
        } else {
          alert('Failed to delete plan');
        }
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete plan');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
      
      <div className={`flex space-x-4 border-b ${state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        {['overview', 'plans', 'analytics', 'users', 'transactions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 capitalize font-medium transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-red-600 text-red-600' 
                : state.theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Users</h3>
                <p className="text-3xl font-bold text-red-600">{backendUsers.length || localUsers.length}</p>
              </div>
              <div className="text-sm font-bold bg-red-100 text-red-600 px-2 py-1 rounded">USERS</div>
            </div>
          </div>
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600">₹{totalRevenue}</p>
              </div>
              <div className="text-sm font-bold bg-green-100 text-green-600 px-2 py-1 rounded">REVENUE</div>
            </div>
          </div>
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Today's Recharges</h3>
                <p className="text-3xl font-bold text-blue-600">{todayRecharges.length}</p>
              </div>
              <div className="text-sm font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded">TODAY</div>
            </div>
          </div>
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Plans</h3>
                <p className="text-3xl font-bold text-purple-600">{plans.length}</p>
              </div>
              <div className="text-sm font-bold bg-purple-100 text-purple-600 px-2 py-1 rounded">PLANS</div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Add/Edit Plan Form */}
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {editingPlan ? 'Edit Plan' : 'Add New Plan'}
            </h2>
            <form onSubmit={editingPlan ? handleUpdatePlan : handleAddPlan} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Plan Name"
                  value={editingPlan ? editingPlan.name : newPlan.name}
                  onChange={(e) => editingPlan 
                    ? setEditingPlan({ ...editingPlan, name: e.target.value })
                    : setNewPlan({ ...newPlan, name: e.target.value })
                  }
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  required
                />
                <select
                  value={editingPlan ? editingPlan.operator : newPlan.operator}
                  onChange={(e) => editingPlan 
                    ? setEditingPlan({ ...editingPlan, operator: e.target.value })
                    : setNewPlan({ ...newPlan, operator: e.target.value })
                  }
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                >
                  <option value="">Select Operator</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Jio">Jio</option>
                  <option value="Vi">Vi</option>
                  <option value="BSNL">BSNL</option>
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={editingPlan ? editingPlan.price : newPlan.price}
                  onChange={(e) => editingPlan 
                    ? setEditingPlan({ ...editingPlan, price: e.target.value })
                    : setNewPlan({ ...newPlan, price: e.target.value })
                  }
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Data (e.g., 2GB/day)"
                  value={editingPlan ? editingPlan.data : newPlan.data}
                  onChange={(e) => editingPlan 
                    ? setEditingPlan({ ...editingPlan, data: e.target.value })
                    : setNewPlan({ ...newPlan, data: e.target.value })
                  }
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  required
                />
                <input
                  type="text"
                  placeholder="Validity (e.g., 28)"
                  value={editingPlan ? editingPlan.validity : newPlan.validity}
                  onChange={(e) => editingPlan 
                    ? setEditingPlan({ ...editingPlan, validity: e.target.value })
                    : setNewPlan({ ...newPlan, validity: e.target.value })
                  }
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  required
                />
                <select
                  value={editingPlan ? editingPlan.category : newPlan.category}
                  onChange={(e) => editingPlan 
                    ? setEditingPlan({ ...editingPlan, category: e.target.value })
                    : setNewPlan({ ...newPlan, category: e.target.value })
                  }
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="unlimited">Unlimited</option>
                  <option value="data">Data</option>
                  <option value="talktime">Talktime</option>
                  <option value="long-term">Long Term</option>
                  <option value="special">Special</option>
                  <option value="international">International</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Benefits (e.g., Unlimited Voice, 100 SMS/day)"
                value={editingPlan ? editingPlan.benefits : newPlan.benefits}
                onChange={(e) => editingPlan 
                  ? setEditingPlan({ ...editingPlan, benefits: e.target.value })
                  : setNewPlan({ ...newPlan, benefits: e.target.value })
                }
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                required
              />
              <div className="flex space-x-2">
                <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {loading ? 'Saving...' : editingPlan ? 'Update Plan' : 'Add Plan'}
                </button>
                {editingPlan && (
                  <button type="button" onClick={() => setEditingPlan(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Plans List */}
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manage Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map(plan => (
                <div key={plan._id || plan.id} className={`border rounded-lg p-4 ${state.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                      <p className={`text-sm font-medium text-blue-600`}>{plan.operator}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <span className="text-xs font-bold bg-blue-100 text-blue-600 px-1 py-0.5 rounded">EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id || plan.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <span className="text-xs font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">DEL</span>
                      </button>
                    </div>
                  </div>
                  <p className={`font-semibold text-lg ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>₹{plan.price}</p>
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Data: {plan.data}</p>
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Validity: {plan.validity} days</p>
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Category: {plan.category}</p>
                  {plan.benefits && (
                    <p className={`text-xs mt-2 ${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{plan.benefits}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Daily Recharge Stats */}
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Daily Recharge Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(dailyRecharges).slice(-7).map(([date, count]) => (
                <div key={date} className={`p-4 rounded-lg ${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(date).toLocaleDateString()}</p>
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className={`text-xs ${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>recharges</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Operator Analysis */}
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Operator Wise Recharge Analysis</h2>
            <div className="space-y-4">
              {Object.entries(operatorStats).map(([operator, count]) => {
                const percentage = Math.round((count / Object.values(operatorStats).reduce((a, b) => a + b, 0)) * 100);
                return (
                  <div key={operator} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{operator}</span>
                      <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{count} recharges ({percentage}%)</span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${state.theme === 'dark' ? 'bg-gray-700' : ''}`}>
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Today's Performance */}
          <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Today's Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{todayRecharges.filter(tx => tx.status === 'success').length}</p>
                <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Successful Recharges</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{todayRecharges.filter(tx => tx.status === 'failed').length}</p>
                <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Failed Recharges</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  ₹{todayRecharges.filter(tx => tx.status === 'success').reduce((sum, tx) => sum + tx.amount, 0)}
                </p>
                <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Today's Revenue</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>User Management</h2>
          <div className="space-y-3">
            {(backendUsers.length ? backendUsers : localUsers).map(user => (
              <div key={user._id || user.id} className={`flex justify-between items-center p-4 border rounded-lg ${state.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                <div>
                  <p className={`font-medium ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Role: {user.role}</p>
                  {user.createdAt && (
                    <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>All User Recharge History</h2>
          {transactions.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className={`${state.theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Mobile</th>
                    <th className="px-4 py-2 text-left">Operator / Plan</th>
                    <th className="px-4 py-2 text-right">Amount (₹)</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx._id || tx.id} className={state.theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                      <td className="px-4 py-2">{tx.userId?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{tx.userId?.email || 'N/A'}</td>
                      <td className="px-4 py-2">{tx.phoneNumber || tx.mobile || 'N/A'}</td>
                      <td className="px-4 py-2">
                        {tx.planId?.name || tx.operator || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-right">{tx.amount}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'completed' || tx.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(tx.status || '').toString().toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2 capitalize">{tx.type || 'recharge'}</td>
                      <td className="px-4 py-2">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              No transactions found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}