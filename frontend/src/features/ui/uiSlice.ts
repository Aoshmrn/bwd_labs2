import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  isLoading: false,
  error: null,
  theme: 'light'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state: UiState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: UiState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state: UiState) => {
      state.error = null;
    },
    toggleTheme: (state: UiState) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    }
  }
});

export const { setLoading, setError, clearError, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer; 