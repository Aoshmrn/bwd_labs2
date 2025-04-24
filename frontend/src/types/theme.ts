export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    background: string;
    text: string;
    error: string;
    success: string;
    border: string;
  };
  transitions: {
    default: string;
    slow: string;
    fast: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}