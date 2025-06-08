import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-4xl font-bold mb-8">Settings</h2>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">This is your settings page. You can configure various options here.</p>
        <p className="text-md text-gray-500 dark:text-gray-400 mt-4">More settings options will be added soon.</p>
      </div>
    </div>
  );
};

export default SettingsPage; 