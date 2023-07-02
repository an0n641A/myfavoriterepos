import {configureStore} from '@reduxjs/toolkit';
import favoriteRepoReducer from './favoriteRepoSlice';
export const store = configureStore({
  reducer: {
    favorite: favoriteRepoReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
