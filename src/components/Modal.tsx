import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white dark:bg-tertiary-light rounded-lg shadow-xl p-6 max-w-lg w-full relative ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal; 