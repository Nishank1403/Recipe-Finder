import React from 'react';

export function Button({ onClick, disabled, children, variant = 'primary', size = 'md' }) {
  const baseClasses = 'px-4 py-2 rounded';
  const variantClasses =
    variant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-red-500 text-white hover:bg-red-600';
  const sizeClasses = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-md';

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses} ${sizeClasses}`}>
      {children}
    </button>
  );
}
