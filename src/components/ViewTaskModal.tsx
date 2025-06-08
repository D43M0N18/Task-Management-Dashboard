import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type Task, type Subtask, type RootState } from '../types';
import { toggleSubtaskCompletion, deleteTask } from '../features/board/boardSlice';
import Modal from './Modal';
import Button from './Button';
import DropdownMenu from './DropdownMenu';
import { EllipsisVertical } from 'lucide-react';

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEditTask: (task: Task) => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ isOpen, onClose, task, onEditTask }) => {
  const dispatch = useDispatch();
  const currentBoardId = useSelector((state: RootState) => state.board.currentBoardId);
  const boards = useSelector((state: RootState) => state.board.boards);
  const currentBoard = boards.find(board => board.id === currentBoardId);

  if (!task || !currentBoard) return null;

  const targetColumn = currentBoard.columns.find(col => col.name === task.status);

  const completedSubtasks = task.subtasks.filter(sub => sub.isCompleted).length;
  const totalSubtasks = task.subtasks.length;

  const handleSubtaskToggle = (subtaskId: string) => {
    if (currentBoardId && targetColumn) {
      dispatch(toggleSubtaskCompletion({
        boardId: currentBoardId,
        columnId: targetColumn.id,
        taskId: task.id,
        subtaskId: subtaskId,
      }));
    }
  };

  const handleDeleteTask = () => {
    if (currentBoardId && targetColumn) {
      dispatch(deleteTask({
        boardId: currentBoardId,
        columnId: targetColumn.id,
        taskId: task.id,
      }));
      onClose(); // Close modal after deletion
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading-lg text-secondary dark:text-white">{task.title}</h2>
        <DropdownMenu
          content={
            <>
              <button
                onClick={() => {
                  onEditTask(task);
                  onClose();
                }}
                className="block w-full text-left px-4 py-2 text-body-md text-quaternary hover:bg-quaternary-light dark:hover:bg-tertiary"
              >
                Edit Task
              </button>
              <button
                onClick={handleDeleteTask}
                className="block w-full text-left px-4 py-2 text-body-md text-danger hover:bg-quaternary-light dark:hover:bg-tertiary"
              >
                Delete Task
              </button>
            </>
          }
        >
          <button className="text-quaternary hover:text-primary transition-colors">
            <EllipsisVertical className="w-6 h-6" />
          </button>
        </DropdownMenu>
      </div>

      <p className="text-body-lg text-quaternary mb-4">{task.description}</p>

      {totalSubtasks > 0 && (
        <div className="mb-4">
          <h3 className="text-body-md text-quaternary dark:text-white mb-2">
            Subtasks ({completedSubtasks} of {totalSubtasks})
          </h3>
          {
            task.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center bg-quaternary-light dark:bg-tertiary rounded-md p-3 mb-2">
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={() => handleSubtaskToggle(subtask.id)}
                  className="mr-4"
                />
                <span className={`text-body-md text-secondary dark:text-white ${subtask.isCompleted ? 'line-through text-quaternary' : ''}`}>
                  {subtask.title}
                </span>
              </div>
            ))
          }
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-body-md text-quaternary dark:text-white mb-2">Current Status</h3>
        <p className="text-body-lg text-secondary dark:text-white capitalize">{task.status}</p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="primary" size="sm" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default ViewTaskModal; 