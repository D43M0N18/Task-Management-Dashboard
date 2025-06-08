import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (
  { variant = 'primary', size = 'md', children, className = '', ...props },
) => {
  const baseStyles = 'font-bold rounded-full transition-colors duration-200';

  const sizeStyles = {
    sm: 'px-4 py-2 text-body-md',
    md: 'px-6 py-3 text-body-lg',
    lg: 'px-8 py-4 text-heading-md',
  };

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-light dark:hover:bg-primary-light',
    secondary:
      'bg-secondary text-white hover:bg-tertiary-light dark:hover:bg-tertiary',
    danger: 'bg-danger text-white hover:bg-danger-light',
    ghost: 'text-quaternary hover:text-primary dark:hover:text-primary',
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim();

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button; 