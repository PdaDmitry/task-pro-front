import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cardsList: [],
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCardsList: (state, action) => {
      state.cardsList = action.payload;
    },
    removeCard: (state, action) => {
      state.cardsList = state.cardsList.filter(c => c._id !== action.payload);
    },
    addCard: (state, action) => {
      state.cardsList.push(action.payload);
    },
    updateCardInList: (state, action) => {
      const index = state.cardsList.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.cardsList[index] = action.payload;
      }
    },
    removeCardList: state => {
      state.cardsList = [];
    },
    updateCardsInColumn: (state, action) => {
      const { columnId, cards } = action.payload;
      if (!columnId) return;

      state.cardsList = state.cardsList.filter(c => c.columnId !== columnId);

      state.cardsList = [...state.cardsList, ...cards];
    },
  },
});

export const {
  setCardsList,
  removeCard,
  addCard,
  updateCardInList,
  removeCardList,
  updateCardsInColumn,
} = cardsSlice.actions;
export const cardsReducer = cardsSlice.reducer;
