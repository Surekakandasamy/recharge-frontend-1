import SAMPLE_PLANS from '../data/plans.js';
import { api } from '../utils/api.js';

// Global state management
class Store {
  constructor() {
    this.state = {
      user: null,
      wallet: { balance: 1000 },
      transactions: [],
      notifications: [],
      theme: 'light',
      plans: [],
      offers: []
    };
    this.listeners = [];
    this.loadPlans();
  }

  async loadPlans() {
    try {
      const plans = await api.getPlans();
      if (plans && plans.length > 0) {
        this.setState({ plans });
      } else {
        this.setState({ plans: SAMPLE_PLANS });
      }
    } catch (error) {
      console.error('Failed to load plans from API, using sample data:', error);
      this.setState({ plans: SAMPLE_PLANS });
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => this.listeners = this.listeners.filter(l => l !== listener);
  }

  setState(updates) {
    this.state = { 
      ...this.state, 
      ...updates,
      wallet: updates.wallet ? { ...this.state.wallet, ...updates.wallet } : this.state.wallet
    };
    this.listeners.forEach(listener => listener(this.state));
  }

  getState() {
    return this.state;
  }
}

export const store = new Store();