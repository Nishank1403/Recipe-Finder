import React from 'react';

export function Card({ children }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {children}
    </div>
  );
}

export function CardHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  );
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}