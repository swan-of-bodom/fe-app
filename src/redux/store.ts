import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import { settings } from "./reducers/settings";
import { network } from "./reducers/network";
import { ui } from "./reducers/ui";

const rootReducer = combineReducers({
  settings: settings.reducer,
  network: network.reducer,
  ui: ui.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
