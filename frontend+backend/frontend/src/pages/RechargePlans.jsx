import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PlansGrid from '../components/PlansGrid';
import SearchFilter from '../components/SearchFilter';
import ApiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SAMPLE_PLANS, { OPERATORS } from '../data/plans';

export default function RechargePlans() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { themeConfig } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const apiPlans = await ApiService.fetchPlans();
    const allPlans = apiPlans.length > 0 ? apiPlans : SAMPLE_PLANS;
    setPlans(allPlans);
    setFilteredPlans(allPlans);
    setLoading(false);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPlans(plans);
      return;
    }
    
    const filtered = plans.filter(plan => 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.benefits?.some(benefit => 
        benefit.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPlans(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...plans];
    
    // Price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(plan => plan.price >= parseInt(filters.priceRange.min));
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(plan => plan.price <= parseInt(filters.priceRange.max));
    }
    
    // Operator filter
    if (filters.operator) {
      filtered = filtered.filter(plan => plan.operator === filters.operator);
    }
    
    // Validity filter
    if (filters.validity) {
      filtered = filtered.filter(plan => plan.validity === filters.validity);
    }
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(plan => plan.category === filters.category);
    }
    
    setFilteredPlans(filtered);
  };

  const handleSelectPlan = (plan) => {
    navigate('/recharge', { state: { selectedPlan: plan } });
  };

  const categoryFilteredPlans = filter === 'all' ? filteredPlans : 
    filter === 'popular' ? filteredPlans.filter(plan => plan.popular) :
    filter === 'unlimited' ? filteredPlans.filter(plan => plan.category === 'unlimited') :
    filter === 'data' ? filteredPlans.filter(plan => plan.category === 'data') :
    filter === 'talktime' ? filteredPlans.filter(plan => plan.category === 'talktime') :
    filteredPlans.filter(plan => plan.price <= 200);

  if (loading) {
    return (
      <div className={`w-full min-h-[calc(100vh-80px)] ${themeConfig.bg} flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`w-full min-h-[calc(100vh-80px)] ${themeConfig.bg} p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${themeConfig.text}`}>Recharge Plans</h1>
          <p className={`text-lg ${themeConfig.textSecondary}`}>Choose from our wide range of prepaid and postpaid plans</p>
        </div>
        
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
        
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className={`${themeConfig.cardBg} ${themeConfig.border} border rounded-md p-1 flex space-x-1 min-w-max shadow-sm`}>
            {[
              { id: 'all', label: 'All Plans' },
              { id: 'popular', label: 'Popular' },
              { id: 'unlimited', label: 'Unlimited' },
              { id: 'data', label: 'Data Only' },
              { id: 'talktime', label: 'Talktime' },
              { id: 'budget', label: 'Budget' }
            ].map(filterType => (
              <button
                key={filterType.id}
                onClick={() => setFilter(filterType.id)}
                className={`px-4 py-2 rounded-sm font-medium transition-colors whitespace-nowrap ${
                  filter === filterType.id 
                    ? 'bg-red-600 text-white' 
                    : `${themeConfig.text} hover:${themeConfig.secondary.split(' ')[0]}`
                }`}
              >
                {filterType.label}
              </button>
            ))}
          </div>
        </div>
        
        <PlansGrid plans={categoryFilteredPlans} onSelect={handleSelectPlan} />
      </div>
    </div>
  );
}