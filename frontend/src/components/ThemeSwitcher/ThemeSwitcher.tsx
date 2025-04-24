import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types/theme';
import styles from './ThemeSwitcher.module.scss';

const ThemeSwitcher = () => {
  const { theme, setMode } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(event.target.value as ThemeMode);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="theme-select" className={styles.label}>
        Theme
      </label>
      <select
        id="theme-select"
        value={theme.mode}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;