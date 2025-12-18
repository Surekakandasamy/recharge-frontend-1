import { createContext, useContext, useState } from 'react';

const WalletContext = createContext({
  walletBalance: 5000,
  paymentHistory: [],
  addMoney: () => {},
  deductMoney: () => {}
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(5000);
  const [paymentHistory, setPaymentHistory] = useState([]);
  
  // Simple notification function
  const addNotification = (notification) => {
    console.log('Notification:', notification.title, '-', notification.message);
  };

  const addMoney = async (amount, method) => {
    const payment = {
      id: `PAY${Date.now()}`,
      amount,
      method,
      status: 'processing',
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    setPaymentHistory(prev => [payment, ...prev]);

    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        setWalletBalance(prev => prev + amount);
        setPaymentHistory(prev => 
          prev.map(p => 
            p.id === payment.id 
              ? { ...p, status: 'success' }
              : p
          )
        );
        addNotification({
          type: 'success',
          title: 'Payment Successful',
          message: `₹${amount} added to wallet via ${method}`
        });
      } else {
        setPaymentHistory(prev => 
          prev.map(p => 
            p.id === payment.id 
              ? { ...p, status: 'failed' }
              : p
          )
        );
        addNotification({
          type: 'error',
          title: 'Payment Failed',
          message: `Failed to add ₹${amount} via ${method}`
        });
      }
    }, 2000);

    return payment.id;
  };

  const deductMoney = (amount) => {
    if (walletBalance >= amount) {
      setWalletBalance(prev => prev - amount);
      return true;
    }
    
    addNotification({
      type: 'warning',
      title: 'Insufficient Balance',
      message: 'Please add money to your wallet'
    });
    return false;
  };

  return (
    <WalletContext.Provider value={{
      walletBalance,
      paymentHistory,
      addMoney,
      deductMoney
    }}>
      {children}
    </WalletContext.Provider>
  );
};