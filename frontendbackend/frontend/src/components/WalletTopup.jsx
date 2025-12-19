import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';

export default function WalletTopup({ isOpen, onClose }) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const { themeConfig } = useTheme();
  const { addMoney } = useWallet();

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'UPI' },
    { id: 'card', name: 'Debit/Credit Card', icon: 'CARD' },
    { id: 'netbanking', name: 'Net Banking', icon: 'NET' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'WALLET' }
  ];

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleTopup = async () => {
    if (!amount || amount < 10) return;
    
    if (selectedMethod === 'upi') {
      if (!upiId) {
        alert('Please enter UPI ID');
        return;
      }
    }
    
    if (selectedMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert('Please fill all card details');
        return;
      }
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      await addMoney(parseInt(amount), selectedMethod);
      setLoading(false);
      setAmount('');
      setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
      setUpiId('');
      onClose();
      alert(`₹${amount} added successfully via ${paymentMethods.find(m => m.id === selectedMethod)?.name}!`);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeConfig.cardBg} rounded-lg p-6 w-full max-w-md border ${themeConfig.border}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${themeConfig.text}`}>Add Money to Wallet</h2>
          <button onClick={onClose} className={`${themeConfig.textSecondary} hover:${themeConfig.text}`}>
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>
              Enter Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum ₹10"
              className={`w-full p-3 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`p-2 border rounded text-sm ${
                    amount === amt.toString()
                      ? 'bg-blue-600 text-white'
                      : `${themeConfig.border} ${themeConfig.text} hover:${themeConfig.secondary}`
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>
              Payment Method
            </label>
            <div className="space-y-2">
              {paymentMethods.map(method => (
                <label key={method.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">{method.icon}</span>
                  <span className={themeConfig.text}>{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedMethod === 'upi' && (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className={`font-medium ${themeConfig.text}`}>UPI Details</h3>
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., user@paytm)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
              />
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className={`font-medium ${themeConfig.text}`}>Card Details</h3>
              <div>
                <input
                  type="text"
                  placeholder="Card Number (1234 5678 9012 3456)"
                  value={cardDetails.number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                    if (value.length <= 19) setCardDetails({...cardDetails, number: value});
                  }}
                  className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
                    if (value.length <= 5) setCardDetails({...cardDetails, expiry: value});
                  }}
                  className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 3) setCardDetails({...cardDetails, cvv: value});
                  }}
                  className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
              />
            </div>
          )}

          <button
            onClick={handleTopup}
            disabled={!amount || amount < 10 || loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded font-medium transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </div>
            ) : (
              `Add ₹${amount || 0} via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}