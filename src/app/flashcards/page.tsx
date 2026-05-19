'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X, Shuffle, Filter } from 'lucide-react';
import { ArabicText } from '@/components/ArabicText';
import { useProgress } from '@/hooks/useProgress';
import vocabularyData from '@/data/vocabulary.json';
import lessonsData from '@/data/lessons.json';
import type { FlashCard } from '@/types';
import { isLessonEnabled } from '@/config/lessons';

const allCards = (vocabularyData as FlashCard[]).filter(c => isLessonEnabled(
  lessonsData.find(l => l.id === c.lesson)?.slug ?? ''
));
const lessons = lessonsData.filter(l => isLessonEnabled(l.slug));

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function FlashcardsPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>('all');
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [cards, setCards] = useState<FlashCard[]>(() => shuffle(allCards));
  const { progress, markFlashcardSeen, markFlashcardLearned } = useProgress();

  const filtered = selectedLesson === 'all'
    ? cards
    : cards.filter(c => c.lesson === selectedLesson);

  const card = filtered[currentIndex] ?? null;
  const learnedCount = filtered.filter(c => progress.flashcardsLearned.includes(c.id)).length;

  const go = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(i => {
        if (dir === 'right') return (i + 1) % filtered.length;
        return (i - 1 + filtered.length) % filtered.length;
      });
      setDirection(null);
    }, 150);
  }, [filtered.length]);

  const handleFlip = () => {
    if (!flipped && card) markFlashcardSeen(card.id);
    setFlipped(f => !f);
  };

  const handleLearned = () => {
    if (card) markFlashcardLearned(card.id);
    go('right');
  };

  const handleReshuffle = () => {
    setCards(shuffle(allCards));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const CATEGORY_COLORS: Record<string, string> = {
    nouns: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    verbs: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    adjectives: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    prepositions: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    pronouns: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    particles: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">Flashcards</h1>
          <p className="text-muted-foreground text-sm">
            {learnedCount}/{filtered.length} learned • {progress.flashcardsSeen.length} seen total
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Filter Row */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => { setSelectedLesson('all'); setCurrentIndex(0); setFlipped(false); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedLesson === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            All ({allCards.length})
          </button>
          {lessons.map(l => {
            const count = allCards.filter(c => c.lesson === l.id).length;
            return (
              <button
                key={l.id}
                onClick={() => { setSelectedLesson(l.id); setCurrentIndex(0); setFlipped(false); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedLesson === l.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                L{l.id} ({count})
              </button>
            );
          })}
          <button
            onClick={handleReshuffle}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-accent transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: filtered.length ? `${(learnedCount / filtered.length) * 100}%` : '0%' }}
          />
        </div>

        {/* Card */}
        {card ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${card.id}-${currentIndex}`}
              initial={{ opacity: 0, x: direction === 'right' ? 40 : direction === 'left' ? -40 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'right' ? -40 : 40 }}
              transition={{ duration: 0.15 }}
              className="flashcard-container mb-6"
            >
              <div
                className={`flashcard-inner w-full cursor-pointer${flipped ? ' flipped' : ''}`}
                style={{ minHeight: '280px' }}
                onClick={handleFlip}
              >
                {/* Front */}
                <div
                  className="flashcard-front w-full bg-card border-2 border-border rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary/40 transition-colors"
                  style={{ minHeight: '280px' }}
                >
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-6 ${CATEGORY_COLORS[card.category] ?? 'bg-muted text-muted-foreground'}`}>
                    {card.category}
                  </div>
                  <ArabicText size="4xl" className="block text-center mb-4">
                    {card.arabic}
                  </ArabicText>
                  <p className="text-sm text-muted-foreground">Tap to reveal</p>
                  {progress.flashcardsLearned.includes(card.id) && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Back */}
                <div
                  className="flashcard-back w-full bg-primary/5 border-2 border-primary/30 rounded-2xl flex flex-col items-center justify-center p-8"
                  style={{ minHeight: '280px' }}
                >
                  <ArabicText size="3xl" className="block text-center mb-3 text-primary">
                    {card.arabic}
                  </ArabicText>
                  <p className="text-muted-foreground italic text-sm mb-2">{card.transliteration}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{card.english}</p>
                  {card.plural && (
                    <div className="flex items-center gap-2 mt-1 mb-1">
                      <span className="text-xs text-muted-foreground">pl.</span>
                      <ArabicText size="md" className="text-primary/80">{card.plural}</ArabicText>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Lesson {card.lesson}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-12 text-center mb-6">
            <p className="text-muted-foreground">No cards in this filter.</p>
          </div>
        )}

        {/* Flip state controls */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => go('left')}
            className="p-3 rounded-xl border border-border hover:bg-accent transition-colors text-muted-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => go('right')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors text-muted-foreground text-sm"
            >
              <X className="w-4 h-4" />
              Skip
            </button>
            <button
              onClick={handleLearned}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              Learned (+5 XP)
            </button>
          </div>

          <button
            onClick={() => go('right')}
            className="p-3 rounded-xl border border-border hover:bg-accent transition-colors text-muted-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Counter */}
        <div className="text-center text-sm text-muted-foreground">
          {filtered.length > 0 ? `${currentIndex + 1} of ${filtered.length}` : '0 cards'}
        </div>

        {/* Reset */}
        <div className="text-center mt-4">
          <button
            onClick={handleReshuffle}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
          >
            <RotateCcw className="w-3 h-3" />
            Reset & shuffle
          </button>
        </div>
      </div>
    </div>
  );
}
