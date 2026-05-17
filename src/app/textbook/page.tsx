'use client';

import { useState } from 'react';
import { BookOpen, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const PDF_PATH = '/arabic-learning/ten-lessons-of-arabic.pdf';

export default function TextbookPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">Ten Lessons of Arabic</h1>
              <p className="text-xs text-muted-foreground">Reference textbook — read alongside the lessons</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={PDF_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border bg-background hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in tab
            </a>
            <a
              href={PDF_PATH}
              download="Ten Lessons of Arabic.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-muted/30 p-4">
        <div className="max-w-6xl mx-auto h-full">
          <iframe
            src={`${PDF_PATH}#page=${currentPage}&toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full rounded-xl border border-border shadow-sm bg-white"
            style={{ height: 'calc(100vh - 160px)', minHeight: '600px' }}
            title="Ten Lessons of Arabic"
          />
        </div>
      </div>

      {/* Fallback message for browsers that block iframe PDFs */}
      <div className="text-center py-3 text-xs text-muted-foreground">
        If the PDF does not display,{' '}
        <a href={PDF_PATH} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
          open it in a new tab
        </a>{' '}
        or{' '}
        <a href={PDF_PATH} download className="text-primary underline underline-offset-2">
          download it
        </a>.
      </div>
    </div>
  );
}
