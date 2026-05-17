'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '@/types';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  lessonProgress: {},
  quizScores: {},
  flashcardsSeen: [],
  flashcardsLearned: [],
  streakDays: 0,
  lastStudied: null,
  totalXP: 0,
  badges: [],
};

const STORAGE_KEY = 'arabic-learning-progress';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  const save = useCallback((updated: UserProgress) => {
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }, []);

  const markLessonComplete = useCallback((lessonId: number) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updated: UserProgress = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalXP: prev.totalXP + 50,
        lastStudied: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateLessonProgress = useCallback((lessonId: number, pct: number) => {
    setProgress(prev => {
      const updated: UserProgress = {
        ...prev,
        lessonProgress: { ...prev.lessonProgress, [lessonId]: pct },
        lastStudied: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveQuizScore = useCallback((quizId: string, score: number) => {
    setProgress(prev => {
      const xpGain = score >= 80 ? 30 : score >= 60 ? 15 : 5;
      const updated: UserProgress = {
        ...prev,
        quizScores: { ...prev.quizScores, [quizId]: score },
        totalXP: prev.totalXP + xpGain,
        lastStudied: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markFlashcardSeen = useCallback((cardId: number) => {
    setProgress(prev => {
      if (prev.flashcardsSeen.includes(cardId)) return prev;
      const updated: UserProgress = {
        ...prev,
        flashcardsSeen: [...prev.flashcardsSeen, cardId],
        totalXP: prev.totalXP + 2,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markFlashcardLearned = useCallback((cardId: number) => {
    setProgress(prev => {
      const updated: UserProgress = {
        ...prev,
        flashcardsSeen: prev.flashcardsSeen.includes(cardId)
          ? prev.flashcardsSeen
          : [...prev.flashcardsSeen, cardId],
        flashcardsLearned: prev.flashcardsLearned.includes(cardId)
          ? prev.flashcardsLearned
          : [...prev.flashcardsLearned, cardId],
        totalXP: prev.flashcardsLearned.includes(cardId) ? prev.totalXP : prev.totalXP + 5,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    loaded,
    save,
    markLessonComplete,
    updateLessonProgress,
    saveQuizScore,
    markFlashcardSeen,
    markFlashcardLearned,
    resetProgress,
  };
}
