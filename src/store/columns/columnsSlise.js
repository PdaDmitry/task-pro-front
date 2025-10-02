import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columnsList: [],
  activeColumn: null,
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumnsList: (state, action) => {
      state.columnsList = action.payload;
    },
    removeColumn: (state, action) => {
      state.columnsList = state.columnsList.filter(c => c._id !== action.payload);
      //   state.activeColumn = null;
    },
    addColumn: (state, action) => {
      state.columnsList.push(action.payload);
    },
    removeColumnsList: (state, action) => {
      state.columnsList = [];
      // state.activeColumn = null;
    },
  },
});

export const { setColumnsList, addColumn, removeColumnsList, removeColumn } = columnsSlice.actions;
export const columnsReducer = columnsSlice.reducer;
