import { mediaQueries } from '../constants/breakpoints';
import { useMediaQuery } from './useMediaQuery';

interface DevicePreferences {
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
  prefersDarkMode: boolean;
}

export const useDevicePreferences = (): DevicePreferences => {
  const isTouchDevice = useMediaQuery(mediaQueries.touchDevice);
  const prefersReducedMotion = useMediaQuery(mediaQueries.reducedMotion);
  const prefersDarkMode = useMediaQuery(mediaQueries.darkMode);

  return {
    isTouchDevice,
    prefersReducedMotion,
    prefersDarkMode,
  };
};