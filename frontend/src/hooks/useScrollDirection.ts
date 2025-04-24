import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = (threshold = 10): ScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [prevOffset, setPrevOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const diff = currentOffset - prevOffset;

      if (Math.abs(diff) < threshold) {
        return;
      }

      setScrollDirection(diff > 0 ? 'down' : 'up');
      setPrevOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevOffset, threshold]);

  return scrollDirection;
};