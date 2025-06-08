import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface BoardState {
  columns: Column[];
  addTask: (columnId: string, task: Task) => void;
  removeTask: (columnId: string, taskId: string) => void;
  moveTask: (sourceColumnId: string, destinationColumnId: string, taskId: string, newIndex: number) => void;
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

type BoardStore = {
  state: BoardState;
  setState: (state: Partial<BoardState>) => void;
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      columns: initialColumns,
      addTask: (columnId: string, task: Task) =>
        set((state: BoardState) => ({
          columns: state.columns.map((column: Column) =>
            column.id === columnId
              ? { ...column, tasks: [...column.tasks, task] }
              : column
          ),
        })),
      removeTask: (columnId: string, taskId: string) =>
        set((state: BoardState) => ({
          columns: state.columns.map((column: Column) =>
            column.id === columnId
              ? {
                  ...column,
                  tasks: column.tasks.filter((task: Task) => task.id !== taskId),
                }
              : column
          ),
        })),
      moveTask: (sourceColumnId: string, destinationColumnId: string, taskId: string, newIndex: number) =>
        set((state: BoardState) => {
          const sourceColumn = state.columns.find((col: Column) => col.id === sourceColumnId);
          const destinationColumn = state.columns.find((col: Column) => col.id === destinationColumnId);
          if (!sourceColumn || !destinationColumn) return state;

          const task = sourceColumn.tasks.find((t: Task) => t.id === taskId);
          if (!task) return state;

          const newSourceTasks = sourceColumn.tasks.filter((t: Task) => t.id !== taskId);
          const newDestinationTasks = [...destinationColumn.tasks];
          newDestinationTasks.splice(newIndex, 0, task);

          return {
            columns: state.columns.map((column: Column) => {
              if (column.id === sourceColumnId) {
                return { ...column, tasks: newSourceTasks };
              }
              if (column.id === destinationColumnId) {
                return { ...column, tasks: newDestinationTasks };
              }
              return column;
            }),
          };
        }),
    }),
    {
      name: 'board-storage',
    }
  )
); 