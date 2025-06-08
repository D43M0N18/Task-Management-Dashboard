import React from 'react';
import { MessageSquare, Paperclip, Calendar } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../store/tasksSlice';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      status: task.status,
      containerId: task.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <MessageSquare size={16} className="mr-1" />
            <span>{task.commentCount}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Paperclip size={16} className="mr-1" />
            <span>{task.fileCount}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Calendar size={16} className="mr-1" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </div>

      {task.subtasks.length > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
            </span>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard; 