'use client';

import React from 'react';

interface InProgressDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
}

export default function InProgressDialog({
  isOpen,
  title,
  message,
}: InProgressDialogProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
