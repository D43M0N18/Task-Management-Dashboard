import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store'; // Assuming RootState is defined in store.ts

interface FilterState {
  priority: 'low' | 'medium' | 'high' | '';
  assignee: string;
  dueDate: 'today' | 'tomorrow' | 'week' | 'overdue' | '';
  searchQuery: string;
}

const initialState: FilterState = {
  priority: '',
  assignee: '',
  dueDate: '',
  searchQuery: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setPriorityFilter: (state, action: PayloadAction<'low' | 'medium' | 'high' | ''>) => {
      state.priority = action.payload;
    },
    setAssigneeFilter: (state, action: PayloadAction<string>) => {
      state.assignee = action.payload;
    },
    setDueDateFilter: (state, action: PayloadAction<'today' | 'tomorrow' | 'week' | 'overdue' | ''>) => {
      state.dueDate = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.priority = '';
      state.assignee = '';
      state.dueDate = '';
      state.searchQuery = '';
    },
  },
});

export const {
  setPriorityFilter,
  setAssigneeFilter,
  setDueDateFilter,
  setSearchQuery,
  clearFilters,
} = filterSlice.actions;

// Selector for searchQuery
export const selectSearchQuery = (state: RootState) => state.filter.searchQuery;

export default filterSlice.reducer; 