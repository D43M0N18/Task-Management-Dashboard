import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import filterReducer from './filterSlice';
import userReducer from './userSlice';
import projectsReducer from './projectsSlice';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  filter: filterReducer,
  user: userReducer,
  projects: projectsReducer,
});

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('kanbanState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('kanbanState', serializedState);
  } catch {}
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState({
    tasks: store.getState().tasks,
    filter: store.getState().filter,
    user: store.getState().user,
    projects: store.getState().projects,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 