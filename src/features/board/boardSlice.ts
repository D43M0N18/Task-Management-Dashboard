import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Board, type Column, type Task } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface BoardState {
  boards: Board[];
  currentBoardId: string | null;
  filterStatus: string | null;
  searchQuery: string;
}

const initialState: BoardState = {
  boards: [],
  currentBoardId: null,
  filterStatus: null,
  searchQuery: '',
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
      if (state.currentBoardId === null) {
        state.currentBoardId = action.payload.id;
      }
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
      if (state.currentBoardId === action.payload) {
        state.currentBoardId = state.boards.length > 0 ? state.boards[0].id : null;
      }
    },
    setCurrentBoard: (state, action: PayloadAction<string>) => {
      state.currentBoardId = action.payload;
    },
    addColumn: (state, action: PayloadAction<{ boardId: string; column: Column }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board) {
        board.columns.push(action.payload.column);
      }
    },
    addTask: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string; task: Task }>
    ) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board) {
        const column = board.columns.find(c => c.id === action.payload.columnId);
        if (column) {
          column.tasks.push(action.payload.task);
        }
      }
    },
    editTask: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string; taskId: string; updatedTask: Task }>
    ) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board) {
        const column = board.columns.find(c => c.id === action.payload.columnId);
        if (column) {
          const taskIndex = column.tasks.findIndex(t => t.id === action.payload.taskId);
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = action.payload.updatedTask;
          }
        }
      }
    },
    deleteTask: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string; taskId: string }>
    ) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board) {
        const column = board.columns.find(c => c.id === action.payload.columnId);
        if (column) {
          column.tasks = column.tasks.filter(t => t.id !== action.payload.taskId);
        }
      }
    },
    toggleSubtaskCompletion: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string; taskId: string; subtaskId: string }>
    ) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board) {
        const column = board.columns.find(c => c.id === action.payload.columnId);
        if (column) {
          const task = column.tasks.find(t => t.id === action.payload.taskId);
          if (task) {
            const subtask = task.subtasks.find(sub => sub.id === action.payload.subtaskId);
            if (subtask) {
              subtask.isCompleted = !subtask.isCompleted;
            }
          }
        }
      }
    },
    moveTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        sourceColumnId: string;
        destinationColumnId: string;
        taskId: string;
        newIndex: number;
      }>
    ) => {
      const { boardId, sourceColumnId, destinationColumnId, taskId, newIndex } = action.payload;
      const board = state.boards.find(b => b.id === boardId);

      if (board) {
        const sourceColumn = board.columns.find(c => c.id === sourceColumnId);
        const destinationColumn = board.columns.find(c => c.id === destinationColumnId);

        if (sourceColumn && destinationColumn) {
          const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
            movedTask.status = destinationColumn.name; // Update status to reflect new column
            destinationColumn.tasks.splice(newIndex, 0, movedTask);
          }
        }
      }
    },
    reorderTasksInColumn: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string; reorderedTasks: Task[] }>
    ) => {
      const { boardId, columnId, reorderedTasks } = action.payload;
      const board = state.boards.find(b => b.id === boardId);

      if (board) {
        const column = board.columns.find(c => c.id === columnId);
        if (column) {
          column.tasks = reorderedTasks;
        }
      }
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { addBoard, deleteBoard, setCurrentBoard, addColumn, addTask, editTask, deleteTask, toggleSubtaskCompletion, moveTask, reorderTasksInColumn, setFilterStatus, setSearchQuery } = boardSlice.actions;

export default boardSlice.reducer;