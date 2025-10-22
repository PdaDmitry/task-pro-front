import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cardsList: [],
  //   activeCard: null,
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
      //   state.activeCard = null;
    },
    addCard: (state, action) => {
      state.cardsList.push(action.payload);
    },
    removeCardList: state => {
      state.cardsList = [];
      // state.activeCard = null;
    },
  },
});

export const { setCardsList, removeCard, addCard } = cardsSlice.actions;
export const cardsReducer = cardsSlice.reducer;
