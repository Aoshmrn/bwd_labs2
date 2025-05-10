import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as apiLogin, register as apiRegister } from '../../api/authService';
import { setToken, removeToken } from '../../utils/tokenStorage';

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isError: false,
  errorMessage: null
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to login');
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterCredentials>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRegister(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isError = false;
      state.errorMessage = null;
      removeToken();
    },
    clearError: (state) => {
      state.isError = false;
      state.errorMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.user = {
          id: action.payload.user.id,
          username: action.payload.user.name,
          email: action.payload.user.email,
          role: action.payload.user.role
        };
        state.token = action.payload.token;
        setToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string || 'Failed to login';
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.user = {
          id: action.payload.user.id,
          username: action.payload.user.name,
          email: action.payload.user.email,
          role: action.payload.user.role
        };
        state.token = action.payload.token;
        setToken(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string || 'Failed to register';
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 