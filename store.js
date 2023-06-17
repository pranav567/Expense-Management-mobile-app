// store.js

//cardmodal
//transactionmodal
//1st transaction to avoid showing home description
//security pin

import { configureStore, createSlice, combineReducers } from "@reduxjs/toolkit";

// Define the initial state and reducer
const initialCardModalState = {
  cardProfileModal: null,
  // transactionCardModal: null,
};

const CardProfileModalSlice = createSlice({
  name: "cardProfileModal",
  initialState: initialCardModalState,
  reducers: {
    setCardProfileModal: (state, action) => {
      state.cardProfileModal = action.payload;
    },
  },
});

const initialTransactionModalState = {
  transactionModal: null,
  // transactionCardModal: null,
};

const TransactionModalSlice = createSlice({
  name: "transactionModal",
  initialState: initialTransactionModalState,
  reducers: {
    setTransactionModal: (state, action) => {
      state.transactionModal = action.payload;
    },
  },
});

const initialLogoutModalState = {
  logoutModal: false,
  // transactionCardModal: null,
};

const LogoutModalSlice = createSlice({
  name: "logoutModal",
  initialState: initialLogoutModalState,
  reducers: {
    setLogoutModal: (state, action) => {
      state.logoutModal = action.payload;
    },
  },
});

const initialSecurityCodeState = {
  securityCode: false,
  credentials: null,
  // transactionCardModal: null,
};

const SecurityCodeSlice = createSlice({
  name: "securityCode",
  initialState: initialSecurityCodeState,
  reducers: {
    setSecurityCode: (state, action) => {
      state.securityCode = action.payload;
    },
    setCredentials: (state, action) => {
      state.credentials = action.payload;
    },
  },
});

const rootReducer = combineReducers({
  cardProfileModal: CardProfileModalSlice.reducer,
  transactionModal: TransactionModalSlice.reducer,
  logoutModal: LogoutModalSlice.reducer,
  securityCode: SecurityCodeSlice.reducer,
});

// Create the Redux store
const store = configureStore({
  reducer: rootReducer,
});

export const { setCardProfileModal } = CardProfileModalSlice.actions;
export const { setTransactionModal } = TransactionModalSlice.actions;
export const { setLogoutModal } = LogoutModalSlice.actions;
export const { setSecurityCode, setCredentials } = SecurityCodeSlice.actions;
export default store;
