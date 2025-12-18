const API_BASE = 'http://localhost:5001/api';

export const api = {
  getPlans: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE}/plans${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  },

  createPlan: async (plan) => {
    try {
      const response = await fetch(`${API_BASE}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error creating plan:', error);
      return null;
    }
  },

  deletePlan: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/plans/${id}`, { method: 'DELETE' });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting plan:', error);
      return false;
    }
  }
};