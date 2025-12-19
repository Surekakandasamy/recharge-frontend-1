const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://recharge-backend-2daw.onrender.com/api';

class ApiService {
  // Plans API
  async fetchPlans() {
    try {
      const response = await fetch(`${API_BASE_URL}/plans`);
      if (!response.ok) throw new Error('Failed to fetch plans');
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  }

  // Users API
  async fetchUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Transactions API
  async fetchTransactions() {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async createUser(userData) {
    try {
      // Backend register endpoint expects: name, email, password, optional phone
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
      if (userData.phone) {
        payload.phone = userData.phone;
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUserSession(sessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/userSessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user session: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating user session:', error);
      throw error;
    }
  }

  async fetchUserSessions() {
    try {
      const response = await fetch(`${API_BASE_URL}/userSessions`);
      if (!response.ok) throw new Error('Failed to fetch user sessions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async createTransaction(transactionData) {
    try {
      console.log('API: Creating transaction:', transactionData);
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API: Transaction creation failed:', errorText);
        throw new Error(`Failed to create transaction: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API: Transaction created successfully:', result);
      return result.data || result;
    } catch (error) {
      console.error('API: Error creating transaction:', error);
      throw error;
    }
  }

  async createPlan(planData) {
    try {
      const planWithDefaults = {
        ...planData,
        id: Date.now().toString(),
        popular: false,
        createdAt: new Date().toISOString()
      };
      const response = await fetch(`${API_BASE_URL}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planWithDefaults)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create plan: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  async updatePlan(id, planData) {
    try {
      const updatedPlan = {
        ...planData,
        updatedAt: new Date().toISOString()
      };
      const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update plan: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  async deletePlan(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete plan: ${errorText}`);
      }
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }
}

export default new ApiService();