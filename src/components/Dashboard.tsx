import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectTasksByStatus } from '../store/tasksSlice';

const Dashboard: React.FC = () => {
  const tasks = useSelector((state: RootState) => selectTasksByStatus(state));
  const currentProject = useSelector((state: RootState) => 
    state.projects.projects.find(p => p.id === state.projects.currentProjectId)
  );

  const totalTasks = Object.values(tasks).reduce((acc, curr) => acc + curr.length, 0);
  const completedTasks = tasks.done.length;
  const inProgressTasks = tasks['in-progress'].length;
  const todoTasks = tasks.todo.length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h3>
          <p className="text-2xl font-bold text-yellow-600">{inProgressTasks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">To Do</h3>
          <p className="text-2xl font-bold text-blue-600">{todoTasks}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Current Project</h2>
        {currentProject ? (
          <div>
            <h3 className="text-lg font-medium">{currentProject.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{currentProject.description}</p>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No project selected</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 