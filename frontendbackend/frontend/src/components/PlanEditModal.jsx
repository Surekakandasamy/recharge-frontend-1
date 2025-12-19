import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function PlanEditModal({ plan, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '', price: '', data: '', validity: '', category: 'unlimited', benefits: ''
  });
  const [loading, setLoading] = useState(false);
  const { themeConfig } = useTheme();

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        benefits: Array.isArray(plan.benefits) ? plan.benefits.join(', ') : plan.benefits || ''
      });
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const planData = {
      ...formData,
      price: parseInt(formData.price),
      benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b)
    };

    try {
      await onSave(planData);
      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeConfig.cardBg} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border ${themeConfig.border}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${themeConfig.text}`}>
            {plan ? 'Edit Plan' : 'Add New Plan'}
          </h2>
          <button
            onClick={onClose}
            className={`${themeConfig.textSecondary} hover:${themeConfig.text} text-2xl`}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Plan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full p-3 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className={`w-full p-3 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Data</label>
              <input
                type="text"
                placeholder="e.g., 2GB/day"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                className={`w-full p-3 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Validity</label>
              <input
                type="text"
                placeholder="e.g., 28 days"
                value={formData.validity}
                onChange={(e) => setFormData({...formData, validity: e.target.value})}
                className={`w-full p-3 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full p-3 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
              >
                <option value="unlimited">Unlimited</option>
                <option value="data">Data</option>
                <option value="talktime">Talktime</option>
                <option value="long-term">Long Term</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Benefits</label>
            <textarea
              placeholder="Enter benefits separated by commas"
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
              className={`w-full p-3 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
              rows="3"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {loading ? 'Saving...' : (plan ? 'Update Plan' : 'Create Plan')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}