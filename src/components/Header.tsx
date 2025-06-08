import React, { useState, useRef, useEffect } from 'react';
import { Share } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userEmail = useSelector((state: RootState) => state.user.user?.email);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock user data as per current userSlice, name/picture are not available
  const userName = userEmail ? userEmail.split('@')[0] : 'Guest';
  const userProfilePic = "https://i.pravatar.cc/150?img=3"; // Example profile picture

  const currentProject = useSelector((state: RootState) => 
    state.projects.projects.find(p => p.id === state.projects.currentProjectId)
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Application URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy URL: ', err));
  };

  const handleAvatarClick = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex justify-between items-center p-6 border-b border-gray-200 bg-white dark:bg-gray-800 z-10"
    >
      <div className="flex items-center space-x-6 w-full">
        {/* Project Title */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white min-w-max">
          {currentProject?.name || 'Select a Project'}
        </h1>
      </div>

      {/* Right section: User Profile and Share */}
      <div className="flex items-center space-x-4 ml-auto">
        <button
          onClick={handleShare}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-2"
        >
          <Share size={20} />
          <span>Share</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={handleAvatarClick} className="focus:outline-none rounded-full">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userProfilePic} alt="User avatar" />
              <AvatarFallback>PJ</AvatarFallback>
            </Avatar>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={userProfilePic} alt="User avatar" />
                  <AvatarFallback>PJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                </div>
              </div>
              <div className="py-1">
                <a
                  href="#"
                  onClick={() => handleMenuItemClick('/profile')}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  My Profile
                </a>
                
                <a
                  href="#"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Header; 