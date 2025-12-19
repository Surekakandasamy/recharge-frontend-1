import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Load transactions from API on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    console.log('TransactionContext: Adding transaction:', transaction);
    
    // Add to local state immediately for instant UI update
    setTransactions(prev => [transaction, ...prev]);
    
    try {
      // Save to API
      const savedTransaction = await ApiService.createTransaction(transaction);
      console.log('TransactionContext: Successfully saved to API:', savedTransaction);
      
      // Update local state with API response (replace the temporary one)
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? { ...t, ...savedTransaction } : t)
      );
      
      // Notify admin dashboard
      window.dispatchEvent(new CustomEvent('transactionAdded', { detail: savedTransaction }));
      
      return savedTransaction;
    } catch (error) {
      console.error('TransactionContext: Failed to save transaction:', error);
      
      // Keep the local transaction even if API fails
      window.dispatchEvent(new CustomEvent('transactionAdded', { detail: transaction }));
      
      return transaction;
    }
  };

  const loadTransactions = async () => {
    try {
      const apiTransactions = await ApiService.fetchTransactions();
      console.log('TransactionContext: Loaded transactions from API:', apiTransactions);
      setTransactions(apiTransactions || []);
    } catch (error) {
      console.error('TransactionContext: Failed to load transactions:', error);
      setTransactions([]);
    }
  };

  const getUserTransactions = (userEmail) => {
    if (!userEmail) return [];
    console.log('Getting transactions for user:', userEmail, 'from', transactions.length, 'total transactions');
    const userTxns = transactions.filter(t => 
      t.userEmail === userEmail || 
      t.user === userEmail ||
      t.email === userEmail
    );
    console.log('Found', userTxns.length, 'transactions for user:', userEmail);
    return userTxns;
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      loadTransactions, 
      getUserTransactions,
      setTransactions 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};