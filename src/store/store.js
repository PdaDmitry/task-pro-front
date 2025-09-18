import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { authReducer } from './auth/authSlice';
import { boardsReducer } from './boards/boards';

const persistAuthConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user'],
};

const persistBoardsConfig = {
  key: 'boards',
  storage,
  whitelist: ['boardsList', 'activeBoard'],
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedBoardsReducer = persistReducer(persistBoardsConfig, boardsReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    boards: persistedBoardsReducer,
    // tasks: tasksReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
