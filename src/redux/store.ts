import { configureStore } from "@reduxjs/toolkit";
import { optionInputSlice, set } from './reducers/optionInput';

export const store = configureStore({
  reducer: optionInputSlice.reducer,
});

// Can still subscribe to the store
store.subscribe(() => console.log({ state: store.getState() }));

// Still pass action objects to `dispatch`, but they're created for us
store.dispatch(set({ maturity: "nasrat", strike: "debile" }));
