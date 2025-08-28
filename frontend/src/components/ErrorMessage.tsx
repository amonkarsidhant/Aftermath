import React from 'react';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message = 'Something went wrong', onRetry }: Props) {
  return (
    <div className="p-4 text-center">
      <p className="text-red-600 dark:text-red-400 mb-2">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1 bg-primary text-white rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
}
