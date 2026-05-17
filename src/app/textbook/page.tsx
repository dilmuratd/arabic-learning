'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Download, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';

const TOTAL_PAGES = 84;
const BASE = '/arabic-learning/textbook';

function pageUrl(n: number) {
  return `${BASE}/page-${String(n).padStart(2, '0')}.png`;
}

export default function TextbookPage() {
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(0); // -1 prev, 1 next
  const [zoomed, setZoomed] = useState(false);
  const [inputVal, setInputVal] = useState('1');

  const goTo = useCallback((next: number, dir: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, next));
    setDirection(dir);
    setPage(clamped);
    setInputVal(String(clamped));
  }, []);

  const prev = () => goTo(page - 1, -1);
  const next = () => goTo(page + 1, 1);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [page]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-4 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">Ten Lessons of Arabic</h1>
              <p className="text-xs text-muted-foreground">Use ← → arrow keys to navigate</p>
            </div>
          </div>

          {/* Page control */}
          <div className="flex items-center gap-2">
            <button onClick={prev} disabled={page === 1}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 text-sm">
              <input
                type="number"
                min={1} max={TOTAL_PAGES}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onBlur={() => {
                  const n = parseInt(inputVal);
                  if (!isNaN(n)) goTo(n, n > page ? 1 : -1);
                  else setInputVal(String(page));
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const n = parseInt(inputVal);
                    if (!isNaN(n)) goTo(n, n > page ? 1 : -1);
                  }
                }}
                className="w-12 text-center border border-border rounded-md px-1 py-0.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-muted-foreground">/ {TOTAL_PAGES}</span>
            </div>

            <button onClick={next} disabled={page === TOTAL_PAGES}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>

            <button onClick={() => setZoomed(z => !z)}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-muted-foreground"
              title={zoomed ? 'Zoom out' : 'Zoom in'}>
              {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

            <a href="/arabic-learning/ten-lessons-of-arabic.pdf" download="Ten Lessons of Arabic.pdf"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Download className="w-3.5 h-3.5" />
              PDF
            </a>
          </div>
        </div>
      </div>

      {/* Page viewer */}
      <div className="flex-1 flex flex-col items-center justify-start py-6 px-4">
        <div className={`relative w-full transition-all duration-300 ${zoomed ? 'max-w-5xl' : 'max-w-2xl'}`}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="w-full"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-white">
                <img
                  src={pageUrl(page)}
                  alt={`Page ${page}`}
                  className="w-full h-auto block"
                  draggable={false}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center gap-4 mt-6">
          <button onClick={prev} disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent disabled:opacity-30 transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Page dots (show nearby pages) */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, TOTAL_PAGES) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 3, TOTAL_PAGES - 6));
              const p = start + i;
              return (
                <button
                  key={p}
                  onClick={() => goTo(p, p > page ? 1 : -1)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    p === page ? 'bg-primary w-4' : 'bg-border hover:bg-muted-foreground'
                  }`}
                />
              );
            })}
          </div>

          <button onClick={next} disabled={page === TOTAL_PAGES}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent disabled:opacity-30 transition-colors text-sm font-medium">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">Page {page} of {TOTAL_PAGES}</p>
      </div>
    </div>
  );
}
