import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(1000);

  const login = (data) => setUser(data);

  const logout = () => setUser(null);

  const deductBalance = (amount) => {
    setBalance(prev => prev - amount);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, balance, deductBalance }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
