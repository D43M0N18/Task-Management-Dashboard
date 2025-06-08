import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import ProjectsList from './ProjectsList';
import Dashboard from './Dashboard';
import Team from './Team';
import Settings from './Settings';
import Board from './Board';
import Header from './Header';

type View = 'board' | 'dashboard' | 'team' | 'settings';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState<View>('board');

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'team':
        return <Team />;
      case 'settings':
        return <Settings />;
      case 'board':
        return <Board />;
      default:
        return <Board />;
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">Kanban</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <ProjectsList />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView('board')}
              className={`w-full flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg ${
                currentView === 'board' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Board</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg ${
                currentView === 'dashboard' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('team')}
              className={`w-full flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg ${
                currentView === 'team' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <Users size={20} />
              <span>Team</span>
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg ${
                currentView === 'settings' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 w-full h-full bg-gray-100 dark:bg-gray-900">
        <Header />
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 