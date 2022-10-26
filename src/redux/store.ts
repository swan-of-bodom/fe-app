import { configureStore } from "@reduxjs/toolkit";
import { optionsList } from "./reducers/optionsList";
import { logger } from "redux-logger";

export const store = configureStore({
  reducer: optionsList.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
