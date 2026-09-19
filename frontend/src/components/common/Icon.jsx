import React from 'react';

export const Icon = ({ name, className = '', size = 20, style = {} }) => {
  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center ${className}`}
      style={{ fontSize: `${size}px`, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default Icon;
