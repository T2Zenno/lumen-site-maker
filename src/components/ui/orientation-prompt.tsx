import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrientation } from '@/hooks/use-orientation';

export function OrientationPrompt() {
  const isMobile = useIsMobile();
  const orientation = useOrientation();

  if (!isMobile || orientation === 'landscape') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mx-4 max-w-sm text-center shadow-lg">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-8 h-8 text-gray-600 dark:text-gray-300 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Putar Layar
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Putar layar untuk pengalaman yang lebih baik
        </p>
      </div>
    </div>
  );
}
