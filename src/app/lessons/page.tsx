'use client';

import { motion } from 'framer-motion';
import { BookOpen, Lock } from 'lucide-react';
import { LessonCard } from '@/components/LessonCard';
import { XPBar } from '@/components/XPBar';
import { useProgress } from '@/hooks/useProgress';
import lessonsData from '@/data/lessons.json';
import type { Lesson } from '@/types';
import { isLessonEnabled } from '@/config/lessons';

const lessons = lessonsData as Lesson[];

export default function LessonsPage() {
  const { progress, loaded } = useProgress();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-background to-teal-50 dark:from-blue-950/20 dark:via-background dark:to-teal-950/20 border-b border-border px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>Arabic Grammar Course</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Lessons</h1>
            <p className="text-muted-foreground">
              10 structured lessons covering all foundational Arabic grammar topics.
            </p>
          </motion.div>
          {loaded && (
            <div className="mt-6">
              <XPBar
                xp={progress.totalXP}
                completedLessons={progress.completedLessons.length}
                totalLessons={lessons.length}
              />
            </div>
          )}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lessons.map((lesson, index) =>
            isLessonEnabled(lesson.slug) ? (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                completed={progress.completedLessons.includes(lesson.id)}
                index={index}
              />
            ) : (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative rounded-2xl border border-dashed border-border bg-muted/30 p-5 flex items-center gap-4 opacity-60 select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Lesson {lesson.id}</p>
                  <p className="font-semibold text-muted-foreground">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Coming soon</p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
