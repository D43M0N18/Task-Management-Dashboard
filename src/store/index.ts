import { combineReducers, configureStore } from '@reduxjs/toolkit';
import boardReducer from '../features/board/boardSlice';
import { type RootState } from '../types';

const localStorageMiddleware = ({ getState }: any) => {
  return (next: any) => (action: any) => {
    const result = next(action);
    localStorage.setItem('kanban-dashboard-state', JSON.stringify(getState()));
    return result;
  };
};

const reHydrateStore = () => {
  if (localStorage.getItem('kanban-dashboard-state') !== null) {
    return JSON.parse(localStorage.getItem('kanban-dashboard-state') || '{}');
  }
  return undefined;
};

const rootReducer = combineReducers({
  board: boardReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; 