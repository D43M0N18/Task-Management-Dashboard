import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { RootState } from '../store/store';
import { selectTasksByStatus, moveTask, reorderTasks, Task } from '../store/tasksSlice';
import Column from './Column';
import AddTaskModal from './AddTaskModal';
import TaskDetailsModal from './TaskDetailsModal';

const Board: React.FC = () => {
  const dispatch = useDispatch();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { todo: todoTasks, 'in-progress': inProgressTasks, done: doneTasks } = useSelector(
    (state: RootState) => selectTasksByStatus(state)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Drag End Event:', event);
    console.log('Active:', active);
    console.log('Over:', over);
    console.log('Active Data Current:', active.data.current);
    console.log('Over Data Current:', over?.data.current);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const getTasksByStatus = (statusId: string) => {
      if (statusId === 'todo') return todoTasks;
      if (statusId === 'in-progress') return inProgressTasks;
      if (statusId === 'done') return doneTasks;
      return [];
    };

    const activeContainerId = active.data.current?.containerId as Task['status'];
    const overContainerId = over.data.current?.containerId as Task['status'];

    const activeStatus = activeContainerId;
    const overStatus = overContainerId;

    const activeTasksList = getTasksByStatus(activeStatus);
    const overTasksList = getTasksByStatus(overStatus);

    if (activeId === overId) {
      return;
    }

    if (activeContainerId === overContainerId) {
      const oldIndex = activeTasksList.findIndex(task => task.id === activeId);
      const newIndex = overTasksList.findIndex(task => task.id === overId);

      console.log('Reordering within same column:');
      console.log('Active Status:', activeStatus);
      console.log('Old Index:', oldIndex);
      console.log('New Index:', newIndex);
      console.log('Active Tasks List:', activeTasksList);
      console.log('Over Tasks List:', overTasksList);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderTasks({
          status: activeStatus,
          oldIndex,
          newIndex,
        }));
      }
    } else {
      console.log('Moving between different columns:');
      console.log('Active ID:', activeId);
      console.log('New Status:', overStatus);
      dispatch(moveTask({ taskId: activeId, newStatus: overStatus }));
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsModalOpen(true);
  };

  const closeTaskDetailsModal = () => {
    setIsTaskDetailsModalOpen(false);
    setSelectedTask(null);
  };

  const columns = [
    { id: 'todo', title: 'To Do', tasks: todoTasks },
    { id: 'in-progress', title: 'In Progress', tasks: inProgressTasks },
    { id: 'done', title: 'Done', tasks: doneTasks },
  ];

  return (
    <div className="flex-1 h-full bg-gray-100 dark:bg-gray-900">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex h-full p-6 gap-6 overflow-x-auto">
            {columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                onAddTask={() => {
                  setSelectedColumn(column.id as 'todo' | 'in-progress' | 'done');
                  setIsAddTaskModalOpen(true);
                }}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          initialStatus={selectedColumn}
        />
      )}

      {isTaskDetailsModalOpen && selectedTask && (
        <TaskDetailsModal
          isOpen={isTaskDetailsModalOpen}
          onClose={closeTaskDetailsModal}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default Board;