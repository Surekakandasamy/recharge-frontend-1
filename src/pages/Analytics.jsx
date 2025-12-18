import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { themeConfig } = useTheme();
  const { getUserTransactions } = useTransactions();
  const { user } = useAuth();

  const userTransactions = useMemo(() => {
    return user?.email ? getUserTransactions(user.email) : [];
  }, [user?.email, getUserTransactions]);

  const analytics = useMemo(() => {
    if (!userTransactions.length) return null;

    const totalSpent = userTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const avgRecharge = Math.round(totalSpent / userTransactions.length);
    
    // Monthly spending
    const monthlyData = {};
    userTransactions.forEach(t => {
      if (t.date) {
        const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + (t.amount || 0);
      }
    });

    // Operator usage
    const operatorData = {};
    userTransactions.forEach(t => {
      if (t.operator) {
        operatorData[t.operator] = (operatorData[t.operator] || 0) + 1;
      }
    });

    const mostUsedOperator = Object.entries(operatorData).sort((a, b) => b[1] - a[1])[0];
    
    // Recharge intervals
    const sortedTransactions = [...userTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    let totalDays = 0;
    let intervals = 0;
    
    for (let i = 0; i < sortedTransactions.length - 1; i++) {
      const current = new Date(sortedTransactions[i].date);
      const next = new Date(sortedTransactions[i + 1].date);
      const daysDiff = Math.abs((current - next) / (1000 * 60 * 60 * 24));
      totalDays += daysDiff;
      intervals++;
    }
    
    const avgInterval = intervals > 0 ? Math.round(totalDays / intervals) : 0;
    const highestRecharge = Math.max(...userTransactions.map(t => t.amount || 0));

    return {
      totalSpent,
      avgRecharge,
      monthlyData,
      mostUsedOperator: mostUsedOperator ? mostUsedOperator[0] : 'N/A',
      avgInterval,
      highestRecharge,
      totalTransactions: userTransactions.length
    };
  }, [userTransactions]);

  if (!analytics) {
    return (
      <div className={`min-h-screen ${themeConfig.bg} p-6`}>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className={`text-3xl font-bold ${themeConfig.text} mb-4`}>Spending Analytics</h1>
          <p className={themeConfig.textSecondary}>No transaction data available for analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeConfig.bg} p-6`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold ${themeConfig.text} mb-6`}>Spending Analytics</h1>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
            <div className="text-center">
              <p className={`text-sm ${themeConfig.textSecondary}`}>Total Spent</p>
              <p className={`text-3xl font-bold text-red-600`}>₹{analytics.totalSpent}</p>
            </div>
          </div>
          
          <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
            <div className="text-center">
              <p className={`text-sm ${themeConfig.textSecondary}`}>Average Recharge</p>
              <p className={`text-3xl font-bold text-blue-600`}>₹{analytics.avgRecharge}</p>
            </div>
          </div>
          
          <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
            <div className="text-center">
              <p className={`text-sm ${themeConfig.textSecondary}`}>Highest Recharge</p>
              <p className={`text-3xl font-bold text-green-600`}>₹{analytics.highestRecharge}</p>
            </div>
          </div>
          
          <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
            <div className="text-center">
              <p className={`text-sm ${themeConfig.textSecondary}`}>Total Recharges</p>
              <p className={`text-3xl font-bold text-purple-600`}>{analytics.totalTransactions}</p>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
            <h3 className={`text-lg font-bold ${themeConfig.text} mb-4`}>Usage Patterns</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className={themeConfig.textSecondary}>Most Used Operator:</span>
                <span className={`font-medium ${themeConfig.text}`}>{analytics.mostUsedOperator}</span>
              </div>
              <div className="flex justify-between">
                <span className={themeConfig.textSecondary}>Average Recharge Interval:</span>
                <span className={`font-medium ${themeConfig.text}`}>{analytics.avgInterval} days</span>
              </div>
            </div>
          </div>

          <div className={`${themeConfig.cardBg} p-6 rounded-lg border ${themeConfig.border}`}>
            <h3 className={`text-lg font-bold ${themeConfig.text} mb-4`}>Monthly Spending</h3>
            <div className="space-y-2">
              {Object.entries(analytics.monthlyData).slice(0, 6).map(([month, amount]) => (
                <div key={month} className="flex justify-between items-center">
                  <span className={themeConfig.textSecondary}>{month}</span>
                  <span className={`font-medium ${themeConfig.text}`}>₹{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}