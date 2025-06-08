import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { selectSearchQuery } from './filterSlice'; // Import the search query selector

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  projectId: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  fileCount: number;
  commentCount: number;
}

interface TasksState {
  tasks: Task[];
  currentProjectId: string | null;
}

const initialState: TasksState = {
  tasks: [],
  currentProjectId: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newStatus: Task['status'] }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
      }
    },
    reorderTasks: (
      state,
      action: PayloadAction<{ status: Task['status']; oldIndex: number; newIndex: number }>
    ) => {
      const { status, oldIndex, newIndex } = action.payload;
      const tasksInColumn = state.tasks.filter(task => task.status === status);
      const taskToMove = tasksInColumn[oldIndex];

      if (taskToMove) {
        const newTasksInColumn = Array.from(tasksInColumn);
        const [removed] = newTasksInColumn.splice(oldIndex, 1);
        newTasksInColumn.splice(newIndex, 0, removed);

        // Update the main tasks array
        state.tasks = state.tasks
          .filter(task => task.status !== status)
          .concat(newTasksInColumn);
      }
    },
    setCurrentProject: (state, action: PayloadAction<string>) => {
      state.currentProjectId = action.payload;
    },
    addSubtask: (state, action: PayloadAction<{ taskId: string; title: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.subtasks.push({
          id: crypto.randomUUID(),
          title: action.payload.title,
          completed: false,
        });
      }
    },
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        const subtask = task.subtasks.find(st => st.id === action.payload.subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
        }
      }
    },
    deleteSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.subtasks = task.subtasks.filter(st => st.id !== action.payload.subtaskId);
      }
    },
    addComment: (state, action: PayloadAction<{ taskId: string; comment: Comment }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.commentCount++;
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasks,
  setCurrentProject,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  addComment,
} = tasksSlice.actions;

// Selectors
const selectTasks = (state: RootState) => state.tasks.tasks;
const selectCurrentProjectId = (state: RootState) => state.projects.currentProjectId;

export const selectTasksByProject = createSelector(
  [selectTasks, selectCurrentProjectId],
  (tasks: Task[], currentProjectId) =>
    tasks.filter((task: Task) => task.projectId === currentProjectId)
);

export const selectFilteredTasks = createSelector(
  [selectTasksByProject, selectSearchQuery],
  (projectTasks: Task[], searchQuery: string) => {
    if (!searchQuery) {
      return projectTasks;
    }
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return projectTasks.filter(
      (task: Task) =>
        task.title.toLowerCase().includes(lowerCaseSearchQuery) ||
        task.description.toLowerCase().includes(lowerCaseSearchQuery) ||
        task.assignee.toLowerCase().includes(lowerCaseSearchQuery)
    );
  }
);

export const selectTasksByStatus = createSelector(
  [selectFilteredTasks], // Depend on memoized selectFilteredTasks
  (filteredTasks: Task[]) => ({
    'todo': filteredTasks.filter((task: Task) => task.status === 'todo'),
    'in-progress': filteredTasks.filter((task: Task) => task.status === 'in-progress'),
    'done': filteredTasks.filter((task: Task) => task.status === 'done'),
  })
);

export default tasksSlice.reducer;