import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import { environmentSwitch } from "./reducers/environment";

const rootReducer = combineReducers({
  environmentSwitch: environmentSwitch.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
