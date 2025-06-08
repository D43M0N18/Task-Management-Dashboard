import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode; // This will be the trigger for the dropdown
  content: React.ReactNode; // This will be the content of the dropdown menu
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, content, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        {children}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-tertiary-light rounded-md shadow-xl z-10">
          {content}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu; 