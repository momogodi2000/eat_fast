// src/components/CommonShare/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'orange', 
  text = '', 
  overlay = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    orange: 'border-orange-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500'
  };

  const spinnerClasses = `
    ${sizeClasses[size] || sizeClasses.medium}
    ${colorClasses[color] || colorClasses.orange}
    border-4 border-t-transparent rounded-full animate-spin
    ${className}
  `;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={spinnerClasses}></div>
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Specialized loading components
export const PageLoader = ({ text = "Loading page..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
    <LoadingSpinner size="large" text={text} />
  </div>
);

export const ButtonLoader = ({ size = 'small', color = 'white' }) => (
  <div className={`${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-t-transparent rounded-full animate-spin`} 
       style={{ borderColor: color === 'white' ? 'white' : '#f97316' }} />
);

export const CardLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-48 w-full rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
      <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
    </div>
  </div>
);

export const TableLoader = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 mb-4">
        {[...Array(columns)].map((_, colIndex) => (
          <div key={colIndex} className="bg-gray-300 h-8 flex-1 rounded"></div>
        ))}
      </div>
    ))}
  </div>
);

export const FullScreenLoader = ({ text = "Loading..." }) => (
  <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size="xlarge" />
      <p className="mt-4 text-lg font-medium text-gray-700">{text}</p>
    </div>
  </div>
);

export default LoadingSpinner;