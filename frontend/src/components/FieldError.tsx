import React from 'react';

interface FieldErrorProps {
  id?: string;
  message?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ id, message }) => {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-xs font-semibold text-brand-danger flex items-center gap-1"
    >
      <svg
        className="w-4 h-4 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </p>
  );
};
