import { configureStore } from "@reduxjs/toolkit";
import { debug } from "../utils/debugger";
import { optionsList } from "./reducers/optionsList";

export const store = configureStore({
  reducer: optionsList.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

// Can still subscribe to the store
store.subscribe(() =>
  debug("Redux store updated", { state: store.getState() })
);
