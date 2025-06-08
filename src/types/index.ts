export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // e.g., 'To Do', 'In Progress', 'Done'
  subtasks: Subtask[];
  // You can add more fields like assignedTo, dueDate, priority, etc.
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Column {
  id: string;
  name: string; // e.g., 'To Do', 'In Progress', 'Done'
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

interface BoardState {
  boards: Board[];
  currentBoardId: string | null;
  filterStatus: string | null;
  searchQuery: string;
}

export interface RootState {
  board: BoardState;
  // Add other UI state or filters here if needed later
} 