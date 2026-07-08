import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className = '' }: CardProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }: CardProps) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
};
