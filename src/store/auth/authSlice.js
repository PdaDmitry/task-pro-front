import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setClientAuth: (state, action) => {
      state.user = {
        name: action.payload.user.name,
        email: action.payload.user.email,
      };
      state.token = action.payload.token;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    updateTheme: (state, action) => {
      if (state.user) {
        state.user.theme = action.payload;
      }
    },
  },
});

export const { setClientAuth, logout, updateTheme } = authSlice.actions;
export const authReducer = authSlice.reducer;
