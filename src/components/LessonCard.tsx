'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';
import { ArabicText } from './ArabicText';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/types';

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
  blue:    { bg: 'bg-blue-50 dark:bg-blue-950/30',    border: 'border-blue-200 dark:border-blue-800',    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-950/30',  border: 'border-amber-200 dark:border-amber-800',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-950/30',    border: 'border-rose-200 dark:border-rose-800',    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
  cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-950/30',    border: 'border-cyan-200 dark:border-cyan-800',    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' },
  teal:    { bg: 'bg-teal-50 dark:bg-teal-950/30',    border: 'border-teal-200 dark:border-teal-800',    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' },
  orange:  { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' },
  red:     { bg: 'bg-red-50 dark:bg-red-950/30',      border: 'border-red-200 dark:border-red-800',      badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' },
  indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-800', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' },
};

interface LessonCardProps {
  lesson: Lesson;
  completed?: boolean;
  locked?: boolean;
  index?: number;
}

export function LessonCard({ lesson, completed = false, locked = false, index = 0 }: LessonCardProps) {
  const colors = COLOR_MAP[lesson.color] ?? COLOR_MAP.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link
        href={locked ? '#' : `/lessons/${lesson.slug}`}
        className={cn(
          'block rounded-2xl border p-5 transition-all duration-200',
          colors.bg, colors.border,
          locked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', colors.badge)}>
                Lesson {lesson.lessonNumber}
              </span>
              {completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              {locked && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{lesson.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{lesson.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <ArabicText size="lg" className={cn('block leading-none mb-1', colors.badge.split(' ')[1])}>
              {lesson.arabicTitleSimple.split('،')[0]}
            </ArabicText>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{lesson.vocabulary.length} words</span>
          <span>•</span>
          <span>{lesson.examples.length} examples</span>
          <span>•</span>
          <span>{lesson.rules.length} rules</span>
        </div>
      </Link>
    </motion.div>
  );
}
