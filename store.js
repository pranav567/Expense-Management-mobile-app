// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

// Define the initial state and reducer
const initialState = {
  cardProfileModal: null,
};

const CardProfileModalSlice = createSlice({
  name: "cardProfileModal",
  initialState,
  reducers: {
    setCardProfileModal: (state, action) => {
      state.cardProfileModal = action.payload;
    },
  },
});

// Create the Redux store
const store = configureStore({
  reducer: {
    cardProfileModal: CardProfileModalSlice.reducer,
  },
});

export const { setCardProfileModal } = CardProfileModalSlice.actions;
export default store;
