import { Provider } from 'react-redux';
import { configureStore, combineReducers, EnhancedStore } from '@reduxjs/toolkit';
import { useAccount } from 'wagmi';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { gamesSlice, type Games } from '../store/gamesSlice';

export type RootState = {
  games: Games;
};

const rootReducer = combineReducers({
  games: gamesSlice.reducer,
});

type Props = {
  children: React.ReactNode;
};

export let store: EnhancedStore<RootState>;

/**
 * Provider for the Redux store, with per-account persistance.
 *
 * Users the chain and account address as localstorage keys, so the application
 * state can be recovered on scenarios like changing the wallet user
 */
export default function AccountStoreProvider({ children }: Props) {
  const { address, chainId } = useAccount();

  const config = {
    key: `${chainId || 'nochain'}-${address || 'anon'}`,
    version: 1,
    storage,
  };

  const persistedReducer = persistReducer(config, rootReducer);
  store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        // These actions are internal of Redux-Persist and should not be serialized
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={<h1>Loading</h1>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
