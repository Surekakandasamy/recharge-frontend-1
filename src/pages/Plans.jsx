import { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { OPERATORS } from '../data/plans';

export default function Plans() {
  const [state, setState] = useStore();
  const [mobile, setMobile] = useState('');
  const [operator, setOperator] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const operators = OPERATORS;
  const categories = [...new Set((state.plans || []).map(p => p.category || 'General').filter(Boolean))];

  const filteredPlans = (state.plans || [])
    .filter(plan => {
      if (!plan) return false;
      const planOperator = plan.operator || plan.name || '';
      const planCategory = plan.category || 'General';
      return (
        (filter === 'all' || planCategory.toLowerCase().includes(filter.toLowerCase())) &&
        (!operator || planOperator === operator)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price') return (a.price || a.amount || 0) - (b.price || b.amount || 0);
      if (sortBy === 'validity') return (a.validity || a.days || 0) - (b.validity || b.days || 0);
      return 0;
    });

  const applyCoupon = (amount) => {
    if (couponCode === 'SAVE20') return amount * 0.8;
    if (couponCode === 'FLAT50' && amount >= 200) return amount - 50;
    return amount;
  };

  const handleRecharge = async (plan) => {
    if (!mobile || mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    
    const originalAmount = plan.price || plan.amount || 0;
    const finalAmount = applyCoupon(originalAmount);
    
    if ((state.wallet?.balance || 0) < finalAmount) {
      alert('Insufficient wallet balance');
      return;
    }

    setLoading(true);
    
    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      
      // Get or create user in backend
      let userId = null;
      try {
        const userResponse = await fetch(`http://localhost:5001/api/users?email=${currentUser?.email}`);
        const userData = await userResponse.json();
        userId = userData.data?.[0]?._id;
        
        if (!userId) {
          // Create user if not exists
          const createResponse = await fetch('http://localhost:5001/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: currentUser.name,
              email: currentUser.email,
              password: currentUser.password || 'temp123',
              phone: currentUser.phone || '0000000000',
              role: currentUser.role || 'user'
            })
          });
          const createResult = await createResponse.json();
          userId = createResult.data?._id;
        }
      } catch (error) {
        console.log('User handling error:', error);
      }
      
      // Helper to store transaction locally (for history & dashboard)
      const saveLocalTransaction = (tx) => {
        const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        localTransactions.push(tx);
        localStorage.setItem('transactions', JSON.stringify(localTransactions));
        // Also update global state so Dashboard/History can use it immediately
        setState({
          wallet: { balance: (state.wallet?.balance || 0) + (tx.type === 'topup' ? tx.amount : -tx.amount) },
          transactions: [...(state.transactions || []), tx],
          lastTransaction: Date.now()
        });
      };
      
      // If still no userId, store transaction in localStorage only
      if (!userId) {
        console.log('Proceeding without backend user ID');
        
        const newTransaction = {
          id: `TXN${Date.now()}`,
          mobile: mobile,
          operator: plan.name,
          amount: finalAmount,
          status: 'success',
          date: new Date().toISOString(),
          type: 'recharge',
          method: 'wallet',
          userEmail: currentUser?.email
        };
        console.log('Storing local-only transaction:', newTransaction);
        saveLocalTransaction(newTransaction);
        alert('Recharge successful!');
        setLoading(false);
        setCouponCode('');
        return;
      }
      
      // Create transaction in backend
      const transactionData = {
        userId: userId,
        type: 'recharge',
        amount: finalAmount,
        status: 'completed',
        description: `Recharge for ${mobile} - ${plan.name}`,
        planId: plan._id || plan.id,
        phoneNumber: mobile
      };
      
      console.log('Creating transaction:', transactionData);
      const transactionResponse = await fetch('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
      
      console.log('Transaction response:', transactionResponse.status);
      if (transactionResponse.ok) {
        const transactionResult = await transactionResponse.json();
        console.log('Transaction result:', transactionResult);
        const transactionId = transactionResult.data._id;
        
        // Also record this transaction locally for history
        const historyTx = {
          id: transactionId,
          mobile,
          operator: plan.name,
          amount: finalAmount,
          status: 'success',
          date: new Date().toISOString(),
          type: 'recharge',
          method: 'wallet',
          userEmail: currentUser?.email
        };
        saveLocalTransaction(historyTx);
        
        // Create payment record
        await fetch('http://localhost:5001/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            transactionId: transactionId,
            amount: finalAmount,
            method: 'wallet',
            status: 'success'
          })
        });
        
        // Update wallet balance in backend
        await fetch('http://localhost:5001/api/wallet/topup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: -finalAmount })
        });
        
        // Create notification
        await fetch('http://localhost:5001/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            title: 'Recharge Successful',
            message: `₹${finalAmount} recharge completed for ${mobile}`,
            type: 'success'
          })
        });
        
        alert('Recharge successful!');
      } else {
        alert('Recharge failed!');
      }
    } catch (error) {
      console.error('Recharge error:', error);
      alert('Recharge failed!');
    }
    
    setLoading(false);
    setCouponCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recharge Plans</h1>
        <div className="text-sm">
          <span className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{filteredPlans.length} plans available</span>
        </div>
      </div>
      
      <div className={`${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
            maxLength="10"
          />
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="">All Operators</option>
            {operators.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="price">Sort by Price</option>
            <option value="validity">Sort by Validity</option>
          </select>
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-red-500 ${state.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
          />
        </div>
        
        {couponCode && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="text-sm">
              {couponCode === 'SAVE20' && '20% discount applied!'}
              {couponCode === 'FLAT50' && 'Flat ₹50 off on orders above ₹200!'}
              {!['SAVE20', 'FLAT50'].includes(couponCode) && 'Invalid coupon code'}
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => {
          const originalAmount = plan.price || plan.amount || 0;
          const finalAmount = applyCoupon(originalAmount);

          return (
            <div key={plan.id} className={`${state.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-lg font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {plan.operator || plan.name}
                </h3>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {plan.category || 'General'}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-red-600">₹{finalAmount}</span>
                  {finalAmount < originalAmount && (
                    <span className={`text-sm line-through ${state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>₹{originalAmount}</span>
                  )}
                </div>
                <p className={`${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Data: {plan.data || plan.description || 'N/A'}
                </p>
                <p className={`${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Validity: {plan.validity || plan.days || 'N/A'} days
                </p>
                {plan.benefits && (
                  <div className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>Benefits: {plan.benefits}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleRecharge(plan)}
                disabled={loading}
                className={`w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Recharge Now'}
              </button>
            </div>
          );
        })}
      </div>
      
      {filteredPlans.length === 0 && (
        <div className={`text-center py-12 ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-6xl mb-4">📱</div>
          <p className="text-xl">No plans found</p>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}