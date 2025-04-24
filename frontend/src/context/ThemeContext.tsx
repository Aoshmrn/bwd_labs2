import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeMode } from '../types/theme';
import { useDevicePreferences } from '../hooks/useDevicePreferences';

interface ThemeContextType {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
}

const defaultTheme: Theme = {
  mode: 'system',
  colors: {
    primary: '#4299e1',
    background: '#ffffff',
    text: '#2d3748',
    error: '#e53e3e',
    success: '#48bb78',
    border: '#e2e8f0',
  },
  transitions: {
    default: '0.3s ease',
    slow: '0.5s ease',
    fast: '0.15s ease',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};

const darkTheme: Theme = {
  ...defaultTheme,
  colors: {
    primary: '#63b3ed',
    background: '#1a202c',
    text: '#e2e8f0',
    error: '#fc8181',
    success: '#68d391',
    border: '#2d3748',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'system';
  });
  const { prefersDarkMode } = useDevicePreferences();

  const theme = React.useMemo(() => {
    const isDefaultDark = mode === 'system' ? prefersDarkMode : mode === 'dark';
    return isDefaultDark ? darkTheme : defaultTheme;
  }, [mode, prefersDarkMode]);

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};