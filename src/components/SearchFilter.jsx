import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { OPERATORS } from '../data/plans';

export default function SearchFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    operator: '',
    validity: '',
    category: ''
  });
  const { themeConfig } = useTheme();

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: { min: '', max: '' },
      operator: '',
      validity: '',
      category: ''
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className={`${themeConfig.cardBg} p-4 rounded-lg border ${themeConfig.border} mb-6`}>
      <div className="flex gap-4 items-center mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search plans, operators, or features..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full p-3 pl-10 border rounded ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded ${themeConfig.border} ${themeConfig.text} hover:${themeConfig.secondary}`}
        >
          🔧 Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Operator</label>
            <select
              value={filters.operator}
              onChange={(e) => handleFilterChange('operator', e.target.value)}
              className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
            >
              <option value="">All Operators</option>
              {OPERATORS.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Validity</label>
            <select
              value={filters.validity}
              onChange={(e) => handleFilterChange('validity', e.target.value)}
              className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
            >
              <option value="">All Validity</option>
              <option value="28 days">28 Days</option>
              <option value="56 days">56 Days</option>
              <option value="84 days">84 Days</option>
              <option value="365 days">365 Days</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeConfig.text} mb-1`}>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className={`w-full p-2 border rounded text-sm ${themeConfig.cardBg} ${themeConfig.text} ${themeConfig.border}`}
            >
              <option value="">All Categories</option>
              <option value="unlimited">Unlimited</option>
              <option value="data">Data</option>
              <option value="talktime">Talktime</option>
              <option value="long-term">Long Term</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}