import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type Task, type Column } from '../types';
import ColumnComponent from '../components/Column';
import { DndContext, closestCorners, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { moveTask, reorderTasksInColumn } from '../features/board/boardSlice';
import DraggableTaskCard from '../components/DraggableTaskCard';

interface BoardViewProps {
  onTaskClick: (task: Task) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ onTaskClick }) => {
  const dispatch = useDispatch();
  const currentBoardId = useSelector((state: RootState) => state.board.currentBoardId);
  const boards = useSelector((state: RootState) => state.board.boards);
  const currentBoard = boards.find(board => board.id === currentBoardId);
  const filterStatus = useSelector((state: RootState) => state.board.filterStatus);
  const searchQuery = useSelector((state: RootState) => state.board.searchQuery);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task as Task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over || !currentBoard) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'Task' && overData?.type === 'Column') {
      const draggedTask = activeData.task as Task;
      const sourceColumn = currentBoard.columns.find(col =>
        col.tasks.some(task => task.id === draggedTask.id)
      );
      const destinationColumn = overData.column as Column;

      if (sourceColumn && destinationColumn && sourceColumn.id !== destinationColumn.id) {
        dispatch(moveTask({
          boardId: currentBoard.id,
          sourceColumnId: sourceColumn.id,
          destinationColumnId: destinationColumn.id,
          taskId: draggedTask.id,
          newIndex: destinationColumn.tasks.length, // Add to the end of the new column for simplicity
        }));
      }
    } else if (activeData?.type === 'Task' && overData?.type === 'Task') {
      const draggedTask = activeData.task as Task;
      const overTask = overData.task as Task;

      const sourceColumn = currentBoard.columns.find(col => col.tasks.some(task => task.id === draggedTask.id));
      const destinationColumn = currentBoard.columns.find(col => col.tasks.some(task => task.id === overTask.id));

      if (sourceColumn && destinationColumn && sourceColumn.id === destinationColumn.id) {
        const oldIndex = sourceColumn.tasks.findIndex(task => task.id === draggedTask.id);
        const newIndex = destinationColumn.tasks.findIndex(task => task.id === overTask.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const updatedTasks = arrayMove(sourceColumn.tasks, oldIndex, newIndex);
          dispatch(reorderTasksInColumn({
            boardId: currentBoard.id,
            columnId: sourceColumn.id,
            reorderedTasks: updatedTasks,
          }));
        }
      } else if (sourceColumn && destinationColumn && sourceColumn.id !== destinationColumn.id) {
        const draggedTask = activeData.task as Task;
        const sourceTaskIndex = sourceColumn.tasks.findIndex(task => task.id === draggedTask.id);
        const destinationTaskIndex = destinationColumn.tasks.findIndex(task => task.id === overTask.id);

        if (sourceTaskIndex !== -1 && destinationTaskIndex !== -1) {
          dispatch(moveTask({
            boardId: currentBoard.id,
            sourceColumnId: sourceColumn.id,
            destinationColumnId: destinationColumn.id,
            taskId: draggedTask.id,
            newIndex: destinationTaskIndex,
          }));
        }
      }
    }
    setActiveTask(null);
  };

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-quaternary text-lg">No board selected. Please create or select a board.</p>
      </div>
    );
  }

  // Apply filtering and search to columns and tasks
  const filteredColumns = currentBoard.columns.map(column => {
    const filteredTasks = column.tasks.filter(task => {
      const matchesFilterStatus = filterStatus ? task.status === filterStatus : true;
      const matchesSearchQuery = searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilterStatus && matchesSearchQuery;
    });
    return { ...column, tasks: filteredTasks };
  }).filter(column => column.tasks.length > 0 || !filterStatus);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-grow overflow-x-auto p-4">
        {filteredColumns.map(column => (
          <ColumnComponent key={column.id} column={column} onTaskClick={onTaskClick} />
        ))}
        <div className="flex-shrink-0 w-72 max-h-[calc(100vh-180px)] overflow-y-auto mr-6 flex items-center justify-center rounded-lg bg-quaternary-light dark:bg-tertiary-light cursor-pointer hover:bg-quaternary dark:hover:bg-tertiary transition-colors">
          <button className="text-heading-xl text-quaternary">+ New Column</button>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <DraggableTaskCard task={activeTask} onClick={onTaskClick} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardView;