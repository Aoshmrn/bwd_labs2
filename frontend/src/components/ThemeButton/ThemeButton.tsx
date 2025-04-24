import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import styles from './ThemeButton.module.scss';

export const ThemeButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.themeButton}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};