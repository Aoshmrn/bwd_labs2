import { useEffect, useState } from 'react';
import { useEffectOnce } from './useEffectOnce';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  const [mediaQuery, setMediaQuery] = useState<MediaQueryList | null>(null);

  useEffectOnce(() => {
    const mq = window.matchMedia(query);
    setMediaQuery(mq);
    setMatches(mq.matches);
  });

  useEffect(() => {
    if (!mediaQuery) return;

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [mediaQuery]);

  return matches;
};