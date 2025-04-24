import { useEffect } from 'react';

export const useThemeSync = () => {
  useEffect(() => {
    const syncTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark-theme', isDark);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', syncTheme);
    syncTheme();

    return () => mediaQuery.removeEventListener('change', syncTheme);
  }, []);
};