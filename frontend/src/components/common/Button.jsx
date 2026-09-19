import React from 'react';
import Icon from './Icon';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  icon = null,
  iconPosition = 'left',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  title = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-label-code-sm gap-1.5',
    md: 'px-3.5 py-2 text-label-code-sm gap-2',
    lg: 'px-4 py-2.5 text-label-code-md gap-2.5'
  }[size] || 'px-3.5 py-2 text-label-code-sm gap-2';

  const variantClasses = {
    primary: 'bg-primary-container hover:bg-primary text-on-primary shadow-sm border border-transparent active:scale-[0.99] transition-all',
    secondary: 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/70 shadow-sm active:scale-[0.99] transition-all',
    danger: 'bg-error hover:bg-error/90 text-on-error shadow-sm border border-transparent active:scale-[0.99] transition-all',
    ghost: 'bg-transparent hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all',
    outline: 'bg-transparent border border-primary-container text-primary-container hover:bg-surface-container transition-all'
  }[variant] || 'bg-primary-container text-on-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center font-label-code font-medium rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
      {icon && iconPosition === 'right' && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
    </button>
  );
};

export default Button;
