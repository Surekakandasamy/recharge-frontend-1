import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';

export default function History() {
  const [state, setState] = useStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTransactions([]); // Clear any existing transactions
    fetchTransactions();
  }, [state.user, state.wallet, state.lastTransaction]); // Re-fetch when user, wallet, or transactions change

  const fetchTransactions = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      // Wait a moment for user to be created in backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user from backend
      const userResponse = await fetch(`http://localhost:5001/api/users?email=${currentUser.email}`);
      const userData = await userResponse.json();
      const currentUserId = userData.data?.[0]?._id;
      
      // If user doesn't exist in backend, check localStorage
      if (!currentUserId) {
        const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        console.log('All localStorage transactions:', localTransactions);
        console.log('Current user email:', currentUser.email);
        const userLocalTransactions = localTransactions.filter(tx => 
          tx.userEmail === currentUser.email
        );
        console.log('Filtered user transactions:', userLocalTransactions);
        setTransactions(userLocalTransactions);
        setState({ transactions: userLocalTransactions });
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost:5001/api/transactions?userId=${currentUserId}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Convert backend format to frontend format
        const formattedTransactions = data.data.map(tx => ({
          id: tx._id,
          mobile: tx.phoneNumber,
          operator: tx.planId?.name || 'Unknown',
          amount: tx.amount,
          status: tx.status === 'completed' ? 'success' : tx.status,
          date: tx.createdAt,
          type: tx.type,
          method: 'wallet'
        }));
        setTransactions(formattedTransactions);
        setState({ transactions: formattedTransactions });
      } else {
        setTransactions([]);
        setState({ transactions: [] });
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
      setState({ transactions: [] });
    }
    setLoading(false);
  };
  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.status === filter || (filter === 'topup' && tx.type === 'topup') || (filter === 'recharge' && tx.type !== 'topup');
    const matchesSearch = !search || 
      (tx.mobile && tx.mobile.includes(search)) ||
      (tx.operator && tx.operator.toLowerCase().includes(search.toLowerCase()));
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const txDate = new Date(tx.date);
      const now = new Date();
      const daysDiff = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));
      
      if (dateRange === '7days') matchesDate = daysDiff <= 7;
      else if (dateRange === '30days') matchesDate = daysDiff <= 30;
      else if (dateRange === '90days') matchesDate = daysDiff <= 90;
    }
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const totalSpent = transactions
    .filter(tx => tx.type !== 'topup' && tx.status === 'success')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalTopups = transactions
    .filter(tx => tx.type === 'topup' && tx.status === 'success')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const successfulRecharges = transactions.filter(tx => tx.type !== 'topup' && tx.status === 'success').length;
  const failedRecharges = transactions.filter(tx => tx.type !== 'topup' && tx.status === 'failed').length;

  const exportData = () => {
    const csvContent = [
      ['Date', 'Type', 'Operator', 'Mobile', 'Amount', 'Status', 'Method'].join(','),
      ...filteredTransactions.map(tx => [
        new Date(tx.date).toLocaleDateString(),
        tx.type === 'topup' ? 'Wallet Top-up' : 'Recharge',
        tx.operator || 'N/A',
        tx.mobile || 'N/A',
        tx.amount,
        tx.status,
        tx.method || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transaction History</h1>
        <button
          onClick={exportData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded">CSV</span>
          <span>Export CSV</span>
        </button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Transactions</h3>
              <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
            </div>
            <div className="text-sm font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded">TOTAL</div>
          </div>
        </div>
        
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Spent</h3>
              <p className="text-3xl font-bold text-red-600">₹{totalSpent}</p>
            </div>
            <div className="text-sm font-bold bg-red-100 text-red-600 px-2 py-1 rounded">SPENT</div>
          </div>
        </div>
        
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Top-ups</h3>
              <p className="text-3xl font-bold text-green-600">₹{totalTopups}</p>
            </div>
            <div className="text-sm font-bold bg-green-100 text-green-600 px-2 py-1 rounded">TOPUP</div>
          </div>
        </div>
        
        <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Success Rate</h3>
              <p className="text-3xl font-bold text-green-600">
                {successfulRecharges + failedRecharges > 0 
                  ? Math.round((successfulRecharges / (successfulRecharges + failedRecharges)) * 100)
                  : 0}%
              </p>
            </div>
            <div className="text-sm font-bold bg-green-100 text-green-600 px-2 py-1 rounded">SUCCESS</div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by mobile number or operator"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All Transactions</option>
            <option value="recharge">Recharges Only</option>
            <option value="topup">Top-ups Only</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          
          <div className={`flex items-center justify-center p-3 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {filteredTransactions.length} results
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
        {loading ? (
          <div className="text-center py-16">
            <div className="text-2xl font-bold text-gray-400 mb-4">LOADING</div>
            <p className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransactions.map(tx => (
              <div key={tx.id} className={`p-6 hover:${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg text-xs font-bold ${
                      tx.type === 'topup' 
                        ? tx.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        : tx.status === 'success' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type === 'topup' ? 'TOP' : 'RCH'}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {tx.type === 'topup' ? 'Wallet Top-up' : `${tx.operator} - ${tx.mobile}`}
                      </h3>
                      <div className={`flex items-center space-x-4 text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>{new Date(tx.date).toLocaleString()}</span>
                        {tx.method && <span>• {tx.method.toUpperCase()}</span>}
                        {tx.coupon && <span>• Coupon: {tx.coupon}</span>}
                      </div>
                      {tx.originalAmount && tx.originalAmount > tx.amount && (
                        <div className="text-sm text-green-600 mt-1">
                          Saved ₹{tx.originalAmount - tx.amount} with coupon
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      tx.type === 'topup' 
                        ? tx.status === 'success' ? 'text-green-600' : 'text-red-600'
                        : tx.status === 'success' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'topup' && tx.status === 'success' ? '+' : ''}₹{tx.amount}
                    </p>
                    {tx.originalAmount && tx.originalAmount > tx.amount && (
                      <p className={`text-sm line-through ${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        ₹{tx.originalAmount}
                      </p>
                    )}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      tx.status === 'success' ? 'bg-green-100 text-green-800' :
                      tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-2xl font-bold text-gray-400 mb-4">NO DATA</div>
            <p className={`text-xl ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No transactions found</p>
            <p className={`${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-6`}>Try adjusting your filters</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearch('');
                setDateRange('all');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}