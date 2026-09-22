import React from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-minimal hover:shadow-minimal-md transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};
