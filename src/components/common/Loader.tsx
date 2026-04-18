import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'blue-600',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const loader = (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizeClasses[size]} 
          border-4 border-t-4 border-gray-200 
          rounded-full animate-spin
          border-t-${color}
        `}
      ></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;