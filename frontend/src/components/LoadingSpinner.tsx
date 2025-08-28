import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4" role="status">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
