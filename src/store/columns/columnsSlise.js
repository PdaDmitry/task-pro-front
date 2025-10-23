import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columnsList: [],
  // activeColumn: null,
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
      // state.activeColumn = null;
    },
    addColumn: (state, action) => {
      state.columnsList.push(action.payload);
    },
    updateColumnInList: (state, action) => {
      const index = state.columnsList.findIndex(с => с._id === action.payload._id);
      if (index !== -1) {
        state.columnsList[index] = action.payload;
      }
    },
    removeColumnsList: state => {
      state.columnsList = [];
      // state.activeColumn = null;
    },
    // setActiveColumn: (state, action) => {
    //   state.activeBoard = action.payload;
    // },
  },
});

export const { setColumnsList, addColumn, updateColumnInList, removeColumnsList, removeColumn } =
  columnsSlice.actions;
export const columnsReducer = columnsSlice.reducer;
