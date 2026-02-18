import React from 'react';

function ValidationError({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center mt-1">
      <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 3.414 9.414a1 1 0 00-1.414 1.414l7 7a1 1 0 001.414 0l9-9z" clipRule="evenodd" />
      </svg>
      <span className="text-sm text-red-600">{message}</span>
    </div>
  );
}

export default ValidationError;
