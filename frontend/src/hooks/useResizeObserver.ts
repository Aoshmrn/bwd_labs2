import { useRef, useEffect, useState } from 'react';

interface DimensionObject {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const useResizeObserver = <T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  DimensionObject | undefined
] => {
  const [dimensions, setDimensions] = useState<DimensionObject>();
  const observerRef = useRef<ResizeObserver>();

  const disconnect = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  };

  const observe = (node: T | null) => {
    disconnect();
    
    if (node) {
      observerRef.current = new ResizeObserver(([entry]) => {
        if (entry && entry.contentRect) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
            x: entry.contentRect.x,
            y: entry.contentRect.y,
          });
        }
      });

      observerRef.current.observe(node);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return [observe, dimensions];
};