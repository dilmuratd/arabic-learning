'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Eye,
  BookOpen,
} from 'lucide-react';
import { ArabicText } from '@/components/ArabicText';
import { isLessonEnabled } from '@/config/lessons';
import lessonsData from '@/data/lessons.json';
import type { Lesson, Exercise, ExerciseItem } from '@/types';
import { cn } from '@/lib/utils';

const enabledLessons = (lessonsData as Lesson[]).filter(l => isLessonEnabled(l.slug));

type PracticeState = 'selecting' | 'practicing' | 'complete';

export default function PracticePage() {
  const [state, setState] = useState<PracticeState>('selecting');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(
    enabledLessons[0]?.id ?? 1
  );
  const [selectedExerciseNum, setSelectedExerciseNum] = useState<number>(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [attempt, setAttempt] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [results, setResults] = useState<boolean[]>([]);

  const selectedLesson = useMemo(
    () => enabledLessons.find(l => l.id === selectedLessonId),
    [selectedLessonId]
  );

  const selectedExercise = useMemo(
    () => selectedLesson?.exercises?.find(e => e.number === selectedExerciseNum),
    [selectedLesson, selectedExerciseNum]
  );

  const items: ExerciseItem[] = selectedExercise?.items ?? [];
  const currentItem = items[currentIdx];

  const startPractice = (lessonId: number, exerciseNum: number) => {
    setSelectedLessonId(lessonId);
    setSelectedExerciseNum(exerciseNum);
    setCurrentIdx(0);
    setAttempt('');
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
    setResults([]);
    setState('practicing');
  };

  const handleGotIt = () => {
    const newResults = [...results, true];
    setResults(newResults);
    advance(newResults, true);
  };

  const handleTryAgain = () => {
    setShowAnswer(false);
    setAttempt('');
  };

  const advance = (newResults: boolean[], wasCorrect: boolean) => {
    const newScore = {
      correct: score.correct + (wasCorrect ? 1 : 0),
      total: score.total + 1,
    };
    setScore(newScore);

    if (currentIdx < items.length - 1) {
      setCurrentIdx(i => i + 1);
      setAttempt('');
      setShowAnswer(false);
    } else {
      setState('complete');
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      setAttempt('');
      setShowAnswer(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < items.length - 1) {
      setCurrentIdx(i => i + 1);
      setAttempt('');
      setShowAnswer(false);
    }
  };

  const retryExercise = () => {
    setCurrentIdx(0);
    setAttempt('');
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
    setResults([]);
    setState('practicing');
  };

  const isArabicDirection = currentItem?.direction === 'translate-to-arabic';
  const progressPercent = items.length > 0 ? ((currentIdx) / items.length) * 100 : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Pencil className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Translation Practice</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Practice translating sentences from Arabic to English and vice versa.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ---- SELECTING ---- */}
          {state === 'selecting' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Lesson tabs */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Select Lesson</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {enabledLessons.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setSelectedLessonId(lesson.id);
                        setSelectedExerciseNum(lesson.exercises?.[0]?.number ?? 1);
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        selectedLessonId === lesson.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      )}
                    >
                      Lesson {lesson.lessonNumber}: {lesson.title}
                    </button>
                  ))}
                </div>

                {/* Exercise buttons */}
                {selectedLesson?.exercises && selectedLesson.exercises.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Select Exercise</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedLesson.exercises.map((ex: Exercise) => {
                        const dirLabel =
                          ex.items[0]?.direction === 'translate-to-arabic'
                            ? 'Translate into Arabic'
                            : ex.items[0]?.direction === 'translate-to-english'
                            ? 'Translate into English'
                            : 'Read Arabic';
                        return (
                          <button
                            key={ex.number}
                            onClick={() => startPractice(selectedLessonId, ex.number)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-foreground"
                          >
                            <span className="text-primary font-semibold">Exercise {ex.number}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{dirLabel}</span>
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({ex.items.length} items)
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
                <Pencil className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Ready to practice?</h2>
                <p className="text-muted-foreground text-sm">
                  Choose a lesson and exercise above to begin translation practice.
                </p>
              </div>
            </motion.div>
          )}

          {/* ---- PRACTICING ---- */}
          {state === 'practicing' && currentItem && (
            <motion.div
              key={`item-${currentIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">
                  {currentIdx + 1} / {items.length}
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  {score.correct} correct
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full mb-6">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Card */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-4">
                {/* Direction badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                      isArabicDirection
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    )}
                  >
                    {isArabicDirection ? '→ Arabic' : '→ English'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Exercise {selectedExerciseNum} · Item {currentItem.number}
                  </span>
                </div>

                {/* Prompt */}
                <div className="mb-5">
                  {!isArabicDirection ? (
                    <div className="bg-muted/30 rounded-xl p-5 text-center">
                      <ArabicText size="lg">{currentItem.text}</ArabicText>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-foreground leading-relaxed">
                      {currentItem.text}
                    </p>
                  )}
                </div>

                {/* Textarea */}
                {!showAnswer && (
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Your translation (optional)
                    </label>
                    <textarea
                      value={attempt}
                      onChange={e => setAttempt(e.target.value)}
                      rows={3}
                      placeholder={
                        isArabicDirection
                          ? 'Type your Arabic translation here...'
                          : 'Type your English translation here...'
                      }
                      className={cn(
                        'w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all',
                        !isArabicDirection ? '' : 'text-right'
                      )}
                      dir={isArabicDirection ? 'rtl' : 'ltr'}
                    />
                  </div>
                )}

                {/* Answer revealed */}
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                        Correct Answer
                      </span>
                    </div>
                    {currentItem.answer ? (
                      isArabicDirection ? (
                        <div className="text-center py-2">
                          <ArabicText size="lg" className="text-emerald-800 dark:text-emerald-200">
                            {currentItem.answer}
                          </ArabicText>
                        </div>
                      ) : (
                        <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                          {currentItem.answer}
                        </p>
                      )
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No answer provided.</p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3">
                {/* Prev / Next navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIdx >= items.length - 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Show answer / Got it / Try again */}
                <div className="flex gap-2">
                  {!showAnswer ? (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-accent transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Show Answer
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleTryAgain}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Try again
                      </button>
                      <button
                        onClick={handleGotIt}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Got it
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ---- COMPLETE ---- */}
          {state === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-card border border-border rounded-2xl p-8 text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Pencil className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Exercise Complete!</h2>
                <div className="text-5xl font-bold text-primary mb-2">
                  {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                </div>
                <p className="text-muted-foreground mb-4">
                  {score.correct} out of {score.total} marked correct
                </p>
                <div
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                    score.total > 0 && score.correct / score.total >= 0.8
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : score.total > 0 && score.correct / score.total >= 0.6
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  )}
                >
                  {score.total > 0 && score.correct / score.total >= 0.8
                    ? 'Excellent work!'
                    : score.total > 0 && score.correct / score.total >= 0.6
                    ? 'Good job!'
                    : 'Keep practicing!'}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setState('selecting')}
                  className="flex items-center gap-2 border border-border px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Change Exercise
                </button>
                <button
                  onClick={retryExercise}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
