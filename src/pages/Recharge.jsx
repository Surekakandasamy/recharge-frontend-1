import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useNotificationContext } from '../context/NotificationContext';
import RechargeForm from '../components/RechargeForm';
import ApiService from '../services/api';

export default function Recharge() {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeConfig } = useTheme();
  const { addTransaction } = useTransactions();
  const { user } = useAuth();
  const { deductMoney } = useWallet();
  const notificationContext = useNotificationContext();
  const addNotification = notificationContext?.addNotification || (() => {});
  const selectedPlan = location.state?.selectedPlan;

  const handleRecharge = async (data) => {
    const now = new Date();
    const transactionData = {
      id: `TXN${Date.now()}`,
      mobile: data.mobile,
      phoneNumber: data.mobile,
      amount: data.amount,
      plan: data.plan.name,
      operator: data.operator,
      user: user?.email || 'unknown@example.com',
      userName: user?.name || user?.email?.split('@')[0] || 'Unknown User',
      userEmail: user?.email || 'unknown@example.com',
      email: user?.email || 'unknown@example.com',
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: true }),
      status: 'completed',
      type: 'Recharge',
      createdAt: now.toISOString()
    };
    
    console.log('Recharge: Creating transaction with data:', transactionData);
    
    // Check wallet balance and deduct money
    const success = deductMoney(data.amount);
    
    if (success) {
      const savedTransaction = await addTransaction(transactionData);
      console.log('Recharge: Transaction saved:', savedTransaction);
      
      try {
        addNotification({
          type: 'success',
          title: 'Recharge Successful',
          message: `₹${data.amount} recharge completed for ${data.mobile}`
        });
      } catch (error) {
        console.log('Recharge Successful:', `₹${data.amount} recharge completed for ${data.mobile}`);
      }
      
      // Force refresh of transaction data
      window.location.reload();
    } else {
      try {
        addNotification({
          type: 'error',
          title: 'Recharge Failed',
          message: 'Insufficient wallet balance. Please add money to your wallet.'
        });
      } catch (error) {
        console.log('Recharge Failed: Insufficient wallet balance');
      }
    }
  };

  if (!selectedPlan) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-6 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl text-center border border-white/20">
          <p className="mb-4 text-lg">No plan selected.</p>
          <button onClick={() => navigate('/plans')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">Go back to plans</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Recharge</h1>
        <RechargeForm selectedPlan={selectedPlan} onClose={() => navigate('/plans')} onRecharge={handleRecharge} />
      </div>
    </div>
  );
}
