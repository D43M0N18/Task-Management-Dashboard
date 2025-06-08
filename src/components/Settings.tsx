import React from 'react';
import { Moon, Sun, Bell, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  toggleDarkMode,
  toggleEmailNotifications,
  togglePushNotifications,
  toggleTwoFactor,
} from '../store/userSlice';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const {
    isDarkMode,
    emailNotifications,
    pushNotifications,
    twoFactorEnabled,
  } = useSelector((state: RootState) => state.user);

  const handleDarkModeToggle = () => {
    document.documentElement.classList.toggle('dark');
    dispatch(toggleDarkMode());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>Dark Mode</span>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <span
                className={`${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell size={20} />
                <span>Email Notifications</span>
              </div>
              <button
                onClick={() => dispatch(toggleEmailNotifications())}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <span
                  className={`${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell size={20} />
                <span>Push Notifications</span>
              </div>
              <button
                onClick={() => dispatch(togglePushNotifications())}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <span
                  className={`${
                    pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock size={20} />
                <span>Two-Factor Authentication</span>
              </div>
              <button
                onClick={() => dispatch(toggleTwoFactor())}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <span
                  className={`${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 