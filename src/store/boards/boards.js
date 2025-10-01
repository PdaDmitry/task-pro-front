import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boardsList: [],
  activeBoard: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setBoardsList: (state, action) => {
      state.boardsList = action.payload;
    },
    addBoard: (state, action) => {
      state.boardsList.push(action.payload);
    },
    updateBoardInList: (state, action) => {
      const index = state.boardsList.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.boardsList[index] = action.payload;
      }
      if (state.activeBoard?._id === action.payload._id) {
        state.activeBoard = action.payload;
      }
    },
    removeBoard: (state, action) => {
      state.boardsList = state.boardsList.filter(b => b._id !== action.payload);
      state.activeBoard = null;
    },
    setActiveBoard: (state, action) => {
      state.activeBoard = action.payload;
    },
    returnInitialState: (state, action) => {
      state.boardsList = [];
      state.activeBoard = null;
    },
  },
});

export const {
  setBoardsList,
  addBoard,
  updateBoardInList,
  removeBoard,
  setActiveBoard,
  returnInitialState,
} = boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;
