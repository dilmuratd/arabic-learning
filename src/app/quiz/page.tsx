'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, ChevronRight, CheckCircle2, XCircle, Lightbulb, Filter } from 'lucide-react';
import { ArabicText } from '@/components/ArabicText';
import { useProgress } from '@/hooks/useProgress';
import quizzesData from '@/data/quizzes.json';
import lessonsData from '@/data/lessons.json';
import type { Quiz } from '@/types';
import { isLessonEnabled } from '@/config/lessons';

const allQuizzes = (quizzesData as Quiz[]).filter(q => isLessonEnabled(
  lessonsData.find(l => l.id === q.lessonId)?.slug ?? ''
));
const lessons = lessonsData.filter(l => isLessonEnabled(l.slug));

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type QuizState = 'selecting' | 'playing' | 'results';

export default function QuizPage() {
  const [state, setState] = useState<QuizState>('selecting');
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>('all');
  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const { saveQuizScore } = useProgress();

  const filtered = useMemo(() =>
    selectedLesson === 'all' ? allQuizzes : allQuizzes.filter(q => q.lessonId === selectedLesson),
    [selectedLesson]
  );

  const startQuiz = () => {
    setQuestions(shuffle(filtered));
    setCurrentIdx(0);
    setSelected(null);
    setAnswers({});
    setShowExplanation(false);
    setState('playing');
  };

  const currentQuestion = questions[currentIdx];
  const isAnswered = selected !== null;
  const isCorrect = selected === currentQuestion?.correct;

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelected(optionIdx);
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      // Calculate score
      const correct = Object.entries(answers).filter(
        ([i, ans]) => ans === questions[parseInt(i)].correct
      ).length;
      const score = Math.round((correct / questions.length) * 100);
      saveQuizScore(`quiz-${Date.now()}`, score);
      setState('results');
    }
  };

  const correctCount = Object.entries(answers).filter(
    ([i, ans]) => ans === questions[parseInt(i)]?.correct
  ).length;

  const OPTION_COLORS = (optionIdx: number) => {
    if (!isAnswered) return 'border-border bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer';
    if (optionIdx === currentQuestion.correct) return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
    if (optionIdx === selected) return 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300';
    return 'border-border bg-card opacity-50';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Quiz</h1>
          </div>
          <p className="text-muted-foreground text-sm">Test your Arabic grammar knowledge.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* --- SELECTING --- */}
          {state === 'selecting' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Choose Topic</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedLesson('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedLesson === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    All Topics ({allQuizzes.length} questions)
                  </button>
                  {lessons.map(l => {
                    const count = allQuizzes.filter(q => q.lessonId === l.id).length;
                    if (!count) return null;
                    return (
                      <button
                        key={l.id}
                        onClick={() => setSelectedLesson(l.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedLesson === l.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {l.title} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Ready to be tested?</h2>
                <p className="text-muted-foreground mb-6">
                  {filtered.length} questions •{' '}
                  {selectedLesson === 'all' ? 'All grammar topics' : lessons.find(l => l.id === selectedLesson)?.title}
                </p>
                <button
                  onClick={startQuiz}
                  disabled={filtered.length === 0}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Start Quiz
                </button>
              </div>
            </motion.div>
          )}

          {/* --- PLAYING --- */}
          {state === 'playing' && currentQuestion && (
            <motion.div
              key={`question-${currentIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-medium">
                  Question {currentIdx + 1} / {questions.length}
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  {correctCount} correct
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full mb-6">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question card */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {currentQuestion.type === 'arabic-to-english' ? 'Arabic → English' : 'Grammar Knowledge'}
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">{currentQuestion.question}</p>

                {/* Show Arabic text larger if it's in the question */}
                {currentQuestion.question.match(/[؀-ۿ]/) && (
                  <div className="bg-muted/30 rounded-xl p-4 text-center mt-2">
                    <ArabicText size="2xl">
                      {currentQuestion.question.match(/[؀-ۿ\s]+/)?.[0]?.trim() ?? ''}
                    </ArabicText>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {currentQuestion.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleAnswer(i)}
                    className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${OPTION_COLORS(i)}`}
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                      {isAnswered ? (
                        i === currentQuestion.correct ? <CheckCircle2 className="w-4 h-4" /> : i === selected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)
                      ) : String.fromCharCode(65 + i)}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${opt.match(/[؀-ۿ]/) ? 'arabic-text text-xl' : ''}`}>
                      {opt}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 mb-4 ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                        {isCorrect ? 'Correct! +10 XP' : 'Incorrect'}
                      </div>
                      <button
                        onClick={() => setShowExplanation(e => !e)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {showExplanation ? 'Hide' : 'Show'} explanation
                      </button>
                      {showExplanation && (
                        <p className="text-sm text-muted-foreground mt-2">{currentQuestion.explanation}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {currentIdx < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* --- RESULTS --- */}
          {state === 'results' && (
            <motion.div
              key="results"
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
                  <Trophy className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
                <div className="text-5xl font-bold text-primary mb-2">
                  {Math.round((correctCount / questions.length) * 100)}%
                </div>
                <p className="text-muted-foreground mb-4">
                  {correctCount} out of {questions.length} correct
                </p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  correctCount / questions.length >= 0.8
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : correctCount / questions.length >= 0.6
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {correctCount / questions.length >= 0.8 ? '🌟 Excellent!' : correctCount / questions.length >= 0.6 ? '👍 Good job!' : '📚 Keep studying!'}
                </div>
              </div>

              {/* Question review */}
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold text-foreground">Review</h3>
                {questions.map((q, i) => {
                  const wasCorrect = answers[i] === q.correct;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
                        wasCorrect
                          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20'
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                      }`}
                    >
                      {wasCorrect
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        : <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">{q.question}</p>
                        {!wasCorrect && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Correct: {q.options[q.correct]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setState('selecting')}
                  className="flex items-center gap-2 border border-border px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Change Topic
                </button>
                <button
                  onClick={startQuiz}
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
