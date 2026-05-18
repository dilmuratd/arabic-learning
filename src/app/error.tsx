'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Auto-reload on chunk load failures (common after GitHub Pages deployments)
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
      <p className="text-muted-foreground">This page failed to load.</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Reload
      </button>
    </div>
  );
}
