'use client';

import { useEffect } from 'react';

export default function QuizError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('dynamically imported module')
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-muted-foreground">The quiz failed to load.</p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Reload
        </button>
        <button
          onClick={reset}
          className="border border-border px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
