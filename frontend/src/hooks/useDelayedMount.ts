import { useEffect, useState } from 'react';

interface UseDelayedMountOutput {
  shouldMount: boolean;
  shouldRender: boolean;
}

export const useDelayedMount = (
  show: boolean,
  mountDelay: number = 0,
  unmountDelay: number = 300
): UseDelayedMountOutput => {
  const [shouldRender, setShouldRender] = useState(false);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    let mountTimer: number;
    let unmountTimer: number;

    if (show) {
      mountTimer = window.setTimeout(() => {
        setShouldMount(true);
        setShouldRender(true);
      }, mountDelay);
    } else {
      setShouldMount(false);
      unmountTimer = window.setTimeout(() => {
        setShouldRender(false);
      }, unmountDelay);
    }

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(unmountTimer);
    };
  }, [show, mountDelay, unmountDelay]);

  return { shouldMount, shouldRender };
};