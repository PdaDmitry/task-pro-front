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

    updateUserProfile: (state, action) => {
      const { name, email, photo } = action.payload;

      if (name) state.user.name = name;
      if (email) state.user.email = email;
      if (photo) state.user.photo = photo;
    },

    // updateUserProfile: (state, action) => {
    //   const { name, email } = action.payload;

    //   if (name) state.user.name = name;
    //   if (email) state.user.email = email;
    // },
  },
});

export const { setClientAuth, logout, updateTheme, updateUserProfile } = authSlice.actions;
export const authReducer = authSlice.reducer;
