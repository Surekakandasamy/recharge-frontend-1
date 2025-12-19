import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const themeConfig = {
    light: {
      bg: 'bg-gray-50',
      cardBg: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      primary: 'bg-red-600 hover:bg-red-700',
      secondary: 'bg-gray-100 hover:bg-gray-200'
    },
    dark: {
      bg: 'bg-gray-900',
      cardBg: 'bg-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
      primary: 'bg-red-600 hover:bg-red-700',
      secondary: 'bg-gray-700 hover:bg-gray-600'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeConfig: themeConfig[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
