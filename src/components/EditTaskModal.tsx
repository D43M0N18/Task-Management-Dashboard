import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateId } from '../utils/idGenerator';
import { editTask } from '../features/board/boardSlice';
import { type RootState, type Subtask, type Task } from '../types';
import Modal from './Modal';
import Button from './Button';
import { X } from 'lucide-react';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task }) => {
  const dispatch = useDispatch();
  const currentBoardId = useSelector((state: RootState) => state.board.currentBoardId);
  const boards = useSelector((state: RootState) => state.board.boards);
  const currentBoard = boards.find(board => board.id === currentBoardId);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || [{ id: generateId('subtask-'), title: '', isCompleted: false }]);
  const [status, setStatus] = useState(task?.status || currentBoard?.columns[0]?.name || '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setSubtasks(task.subtasks.length > 0 ? task.subtasks : [{ id: generateId('subtask-'), title: '', isCompleted: false }]);
      setStatus(task.status);
    } else if (currentBoard && currentBoard.columns.length > 0) {
      setStatus(currentBoard.columns[0].name);
    }
  }, [task, currentBoard]);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: generateId('subtask-'), title: '', isCompleted: false }]);
  };

  const handleSubtaskChange = (id: string, newTitle: string) => {
    setSubtasks(subtasks.map(sub => (sub.id === id ? { ...sub, title: newTitle } : sub)));
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(sub => sub.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBoardId || !currentBoard || !task) {
      console.error('No board or task selected.');
      return;
    }

    const targetColumn = currentBoard.columns.find(col => col.name === status);
    if (!targetColumn) {
      console.error('Target column not found.');
      return;
    }

    const updatedTask: Task = {
      ...task,
      title,
      description,
      status,
      subtasks: subtasks.map(subtask => ({
        id: subtask.id || generateId('subtask-'),
        title: subtask.title,
        isCompleted: subtask.isCompleted
      })).filter(sub => sub.title.trim() !== ''),
    };

    dispatch(editTask({ boardId: currentBoardId, columnId: targetColumn.id, taskId: task.id, updatedTask }));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-heading-lg text-secondary dark:text-white mb-6">Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="edit-title" className="block text-body-md text-quaternary dark:text-white mb-2">
            Title
          </label>
          <input
            type="text"
            id="edit-title"
            className="w-full p-2 border border-quaternary-light dark:border-tertiary-light rounded-md bg-transparent text-secondary dark:text-white"
            placeholder="e.g. Take coffee break"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="edit-description" className="block text-body-md text-quaternary dark:text-white mb-2">
            Description
          </label>
          <textarea
            id="edit-description"
            className="w-full p-2 border border-quaternary-light dark:border-tertiary-light rounded-md bg-transparent text-secondary dark:text-white h-24 resize-none"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-body-md text-quaternary dark:text-white mb-2">
            Subtasks
          </label>
          {subtasks.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center mb-2">
              <input
                type="text"
                className="flex-1 p-2 border border-quaternary-light dark:border-tertiary-light rounded-md bg-transparent text-secondary dark:text-white mr-2"
                placeholder={index === 0 ? 'e.g. Make coffee' : index === 1 ? 'e.g. Drink coffee & smile' : ''}
                value={subtask.title}
                onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                required={subtask.title.trim() === '' && subtasks.length > 1}
              />
              <button
                type="button"
                onClick={() => handleRemoveSubtask(subtask.id)}
                className="text-quaternary hover:text-danger"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={handleAddSubtask} className="w-full">
            + Add New Subtask
          </Button>
        </div>

        <div className="mb-6">
          <label htmlFor="edit-status" className="block text-body-md text-quaternary dark:text-white mb-2">
            Status
          </label>
          <select
            id="edit-status"
            className="w-full p-2 border border-quaternary-light dark:border-tertiary-light rounded-md bg-transparent text-secondary dark:text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {currentBoard?.columns.map(column => (
              <option key={column.id} value={column.name}>
                {column.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="primary" size="md" className="w-full">
          Save Changes
        </Button>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
 