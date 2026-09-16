import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('attar_token');
          const userStr = localStorage.getItem('attar_user');
          const user = userStr ? JSON.parse(userStr) : null;
          state.token = token;
          state.user = user;
          state.isAuthenticated = !!token;
          state.isAdmin = user?.role === 'admin';
        } catch (e) {
          console.error('Failed to hydrate auth', e);
        }
      }
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isAdmin = user.role === 'admin';

      if (typeof window !== 'undefined') {
        localStorage.setItem('attar_token', token);
        localStorage.setItem('attar_user', JSON.stringify(user));
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAdmin = action.payload.role === 'admin';
      if (typeof window !== 'undefined') {
        localStorage.setItem('attar_user', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('attar_token');
        localStorage.removeItem('attar_user');
      }
    },
  },
});

export const { hydrateAuth, setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
