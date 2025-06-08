import { create } from 'zustand';
import { DropResult } from 'react-beautiful-dnd';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardState {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  moveTask: (result: DropResult) => void;
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Design System',
        description: 'Create a design system for the application',
        priority: 'high',
        assignee: {
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/100?img=1',
        },
      },
      {
        id: '2',
        title: 'User Authentication',
        description: 'Implement user authentication flow',
        priority: 'medium',
        assignee: {
          name: 'Jane Smith',
          avatar: 'https://i.pravatar.cc/100?img=2',
        },
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'API Integration',
        description: 'Integrate with backend API',
        priority: 'high',
        assignee: {
          name: 'Mike Johnson',
          avatar: 'https://i.pravatar.cc/100?img=3',
        },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: '4',
        title: 'Project Setup',
        description: 'Set up project structure and dependencies',
        priority: 'low',
        assignee: {
          name: 'Sarah Wilson',
          avatar: 'https://i.pravatar.cc/100?img=4',
        },
      },
    ],
  },
];

export const useStore = create<BoardState>((set) => ({
  columns: initialColumns,
  setColumns: (columns) => set({ columns }),
  moveTask: (result) => {
    const { source, destination } = result;
    if (!destination) return;

    set((state) => {
      const newColumns = [...state.columns];
      const sourceColumn = newColumns.find((col) => col.id === source.droppableId);
      const destColumn = newColumns.find((col) => col.id === destination.droppableId);

      if (!sourceColumn || !destColumn) return state;

      const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
      destColumn.tasks.splice(destination.index, 0, movedTask);

      return { columns: newColumns };
    });
  },
})); 