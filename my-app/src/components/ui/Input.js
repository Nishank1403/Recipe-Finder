import React from 'react';

export function Input({ type = 'text', placeholder, value, onChange, className }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded p-2 ${className}`} // Add any additional classes passed via className prop
    />
  );
}
