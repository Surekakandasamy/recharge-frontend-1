import ApiService from '../services/api';

export const auth = {
  register: async (userData) => {
    try {
      // Ensure user is stored in MongoDB via backend API
      const result = await ApiService.createUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
      });

      console.log('Backend register response:', result);
      if (result?.success === false && !result.message?.includes('already exists')) {
        throw new Error(result.message || 'Registration failed');
      }
      
      // Create frontend user object
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '0000000000',
        role: userData.role || 'user',
        wallet: { balance: 5000 },
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingIndex = users.findIndex(u => u.email === userData.email);
      if (existingIndex >= 0) {
        users[existingIndex] = newUser;
      } else {
        users.push(newUser);
      }
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  login: async (email, password) => {
    // Check localStorage first
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Ensure user exists in backend
      try {
        const response = await fetch('http://localhost:5001/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone || '0000000000',
            role: user.role || 'user'
          })
        });
        const result = await response.json();
        console.log('Backend login response:', result);
      } catch (error) {
        console.log('Backend sync failed:', error);
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
};