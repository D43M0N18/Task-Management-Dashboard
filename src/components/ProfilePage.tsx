import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ProfilePage: React.FC = () => {
  const userEmail = useSelector((state: RootState) => state.user.user?.email);
  const userName = userEmail ? userEmail.split('@')[0] : 'Guest';
  const userProfilePic = "https://i.pravatar.cc/150?img=3"; // Example profile picture

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-4xl font-bold mb-8">My Profile</h2>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
        <img src={userProfilePic} alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-indigo-500" />
        <p className="text-2xl font-semibold">{userName}</p>
        <p className="text-lg text-gray-600 dark:text-gray-300">{userEmail}</p>
        <p className="text-md text-gray-500 dark:text-gray-400">This is your profile page. More details will be added here.</p>
      </div>
    </div>
  );
};

export default ProfilePage; 