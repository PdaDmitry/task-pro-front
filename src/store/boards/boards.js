import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boardsList: [],
  activeBoard: {},
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
    },
    removeBoard: (state, action) => {
      state.boardsList = state.boardsList.filter(b => b._id !== action.payload);
    },
    setActiveBoardId: (state, action) => {
      state.activeBoard.activeBoardId = action.payload;
    },
  },
});

export const { setBoardsList, addBoard, updateBoardInList, removeBoard, setActiveBoardId } =
  boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;
