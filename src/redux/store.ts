import { configureStore } from "@reduxjs/toolkit";
import { optionsList } from './reducers/optionsList';

export const store = configureStore({
  reducer: optionsList.reducer,
});

// Can still subscribe to the store
store.subscribe(() => console.log({ state: store.getState() }));
