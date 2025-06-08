import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task } from '../store/tasksSlice';
import TaskCard from './TaskCard';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, onAddTask, onTaskClick }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{tasks.length}</span>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className="p-4 space-y-3 min-h-[200px]"
        >
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </SortableContext>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onAddTask}
            className="w-full flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Column; 