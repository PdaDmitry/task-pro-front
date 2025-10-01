import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    isLoading: false,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = loaderSlice.actions;
export const loaderReducer = loaderSlice.reducer;
