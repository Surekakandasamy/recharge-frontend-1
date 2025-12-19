import { useState } from 'react';
import { useStore } from '../hooks/useStore';

export default function Wallet() {
  const [state, setState] = useStore();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleTopup = (e) => {
    e.preventDefault();
    const topupAmount = parseFloat(amount);
    
    if (!topupAmount || topupAmount < 10) {
      alert('Minimum topup amount is ₹10');
      return;
    }

    if (topupAmount > 50000) {
      alert('Maximum topup amount is ₹50,000');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      
      const transaction = {
        id: Date.now(),
        type: 'topup',
        amount: topupAmount,
        method: paymentMethod,
        status: success ? 'success' : 'failed',
        date: new Date().toISOString()
      };

      if (success) {
        setState({
          wallet: { balance: (state.wallet?.balance || 0) + topupAmount },
          transactions: [...transactions, transaction],
          notifications: [...(state.notifications || []), {
            id: Date.now(),
            message: `Wallet topped up with ₹${topupAmount}`,
            type: 'success',
            timestamp: new Date().toISOString()
          }]
        });
        setAmount('');
        alert('Wallet topped up successfully!');
      } else {
        setState({
          transactions: [...transactions, transaction],
          notifications: [...(state.notifications || []), {
            id: Date.now(),
            message: `Wallet topup failed for ₹${topupAmount}`,
            type: 'error',
            timestamp: new Date().toISOString()
          }]
        });
        alert('Payment failed. Please try again.');
      }
      
      setLoading(false);
    }, 2000);
  };

  const transactions = state.transactions || [];
  const walletTransactions = transactions.filter(tx => tx.type === 'topup');
  const totalTopups = walletTransactions.reduce((sum, tx) => tx.status === 'success' ? sum + tx.amount : sum, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Wallet</h1>
        <div className="text-sm">
          <span className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total topped up: ₹{totalTopups}
          </span>
        </div>
      </div>
      
      {/* Current Balance */}
      <div className={`${state.theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-red-500 to-red-600'} p-8 rounded-xl shadow-lg text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium opacity-90">Current Balance</h2>
            <p className="text-4xl font-bold mt-2">₹{state.wallet.balance}</p>
            <p className="text-sm opacity-75 mt-2">Available for recharge</p>
          </div>
          <div className="text-6xl opacity-50">💰</div>
        </div>
      </div>
      
      {/* Top Up Section */}
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Top Up Wallet</h2>
        
        {/* Quick Amount Buttons */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-3 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Quick Select Amount
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickAmounts.map(quickAmount => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className={`p-3 rounded-lg border-2 transition-all ${
                  amount === quickAmount.toString()
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : state.theme === 'dark'
                    ? 'border-gray-600 hover:border-red-500 text-gray-300 hover:text-white'
                    : 'border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600'
                }`}
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleTopup} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Custom Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (₹10 - ₹50,000)"
              className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              min="10"
              max="50000"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'upi', label: 'UPI', icon: '📱' },
                { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                { value: 'netbanking', label: 'Net Banking', icon: '🏦' }
              ].map(method => (
                <label
                  key={method.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === method.value
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : state.theme === 'dark'
                      ? 'border-gray-600 hover:border-red-500 text-gray-300'
                      : 'border-gray-300 hover:border-red-500 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <span>💳</span>
                <span>Top Up ₹{amount || '0'}</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Wallet History */}
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <h2 className={`text-xl font-semibold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Wallet History</h2>
        
        {walletTransactions.length > 0 ? (
          <div className="space-y-3">
            {walletTransactions.slice(-10).reverse().map(tx => (
              <div key={tx.id} className={`flex justify-between items-center p-4 ${state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${tx.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.status === 'success' ? '✅' : '❌'}
                  </div>
                  <div>
                    <p className={`font-medium ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Wallet Top-up
                    </p>
                    <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(tx.date).toLocaleString()} • {tx.method?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.status === 'success' ? '+' : ''}₹{tx.amount}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <p className={`text-xl ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No wallet transactions yet</p>
            <p className={`${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Top up your wallet to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}