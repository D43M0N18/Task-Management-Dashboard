import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Plus, Trash2 } from 'lucide-react';
import { Task, updateTask, deleteTask } from '../store/tasksSlice';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task }) => {
  const dispatch = useDispatch();
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    dispatch(updateTask(editedTask));
    onClose();
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    onClose();
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setEditedTask({
        ...editedTask,
        subtasks: [
          ...editedTask.subtasks,
          { id: crypto.randomUUID(), title: newSubtask.trim(), completed: false },
        ],
      });
      setNewSubtask('');
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.filter(subtask => subtask.id !== subtaskId),
    });
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      ),
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setEditedTask({
        ...editedTask,
        commentCount: editedTask.commentCount + 1,
      });
      setNewComment('');
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 w-full"
            />
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[editedTask.priority]}`}>
                {editedTask.priority}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {editedTask.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={editedTask.assignee}
                onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={editedTask.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subtasks
            </label>
            <div className="space-y-2">
              {editedTask.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className={`text-gray-700 dark:text-gray-300 ${subtask.completed ? 'line-through' : ''}`}>
                      {subtask.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 p-2 border rounded-l bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              />
              <button
                onClick={handleAddSubtask}
                className="bg-primary text-white px-4 rounded-r hover:bg-primary-hover"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comments
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="bg-primary text-white px-4 rounded hover:bg-primary-hover"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            Delete Task
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal; 