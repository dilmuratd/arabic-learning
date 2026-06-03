'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2, ArrowLeft, ArrowRight, BookOpen,
  Lightbulb, List, Star, ChevronRight, PenLine, Grid3X3
} from 'lucide-react';
import { ArabicText } from '@/components/ArabicText';
import { ColoredWord } from '@/components/GrammarBadge';
import { MixedText } from '@/components/MixedText';
import { useProgress } from '@/hooks/useProgress';
import lessonsData from '@/data/lessons.json';
import vocabularyData from '@/data/vocabulary.json';
import type { Lesson, FlashCard } from '@/types';

const lessons = lessonsData as Lesson[];
const allVocabulary = vocabularyData as FlashCard[];

const ROLE_LABELS: Record<string, string> = {
  mubtada: 'Mubtada',
  khabar: 'Khabar',
  verb: 'Fiʿl',
  faail: "Fā'il",
  mafool: "Maf'ūl",
  mudaaf: 'Muḍāf',
  'mudaaf-ilayhi': 'Muḍāf Ilayhi',
  'jar-majroor': 'Jār-Majrūr',
  sifa: 'Ṣifa',
  mawsoof: 'Mawṣūf',
  'nahy-particle': 'Nahy Lā',
};

export default function LessonDetail({ slug }: { slug: string }) {
  const lesson = lessons.find(l => l.slug === slug);
  if (!lesson) notFound();

  const { progress, markLessonComplete } = useProgress();
  const lessonVocabulary = allVocabulary.filter(w => w.lesson === lesson.id);
  const isCompleted = progress.completedLessons.includes(lesson.id);

  const lessonIndex = lessons.findIndex(l => l.slug === slug);
  const prev = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const next = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/lessons" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Lessons
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Lesson {lesson.lessonNumber}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground font-medium mb-1">LESSON {lesson.lessonNumber}</div>
              <h1 className="text-2xl font-bold text-foreground mb-1">{lesson.title}</h1>
              <p className="text-muted-foreground text-sm">{lesson.description}</p>
            </div>
            <div className="text-right shrink-0">
              <ArabicText size="xl" className="block text-muted-foreground">
                {lesson.arabicTitleSimple.split('،')[0]}
              </ArabicText>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {/* Key Concepts */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            Key Concepts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.concepts.map(c => (
              <div key={c.term} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-xs font-medium text-primary">{c.transliteration}</div>
                    <div className="font-semibold text-foreground">{c.english}</div>
                  </div>
                  <ArabicText size="lg" className="text-muted-foreground">{c.term}</ArabicText>
                </div>
                <MixedText className="text-xs text-muted-foreground">{c.description}</MixedText>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Grammar Points */}
        {lesson.grammarPoints && lesson.grammarPoints.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Grammar Points
            </h2>
            <div className="space-y-3">
              {lesson.grammarPoints.map((gp, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2 text-sm">
                    {i + 1}.{' '}
                    {gp.title.includes(' — ') ? (
                      <>
                        <span>{gp.title.split(' — ')[0]}</span>
                        {' — '}
                        <span
                          dir="rtl"
                          style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: '1.1em', unicodeBidi: 'isolate' } as React.CSSProperties}
                        >
                          {gp.title.split(' — ')[1]}
                        </span>
                      </>
                    ) : (
                      <MixedText>{gp.title}</MixedText>
                    )}
                  </h3>
                  <MixedText className="text-sm text-muted-foreground leading-relaxed">{gp.explanation}</MixedText>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Rules */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
            <List className="w-5 h-5 text-primary" />
            Rules
          </h2>
          <div className="space-y-2">
            {lesson.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 bg-muted/40 rounded-lg px-4 py-3">
                <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <MixedText className="text-sm text-foreground">{rule}</MixedText>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Examples */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            Examples
          </h2>
          <div className="space-y-4">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="flex flex-row-reverse flex-wrap items-end justify-center gap-1 mb-4 py-2">
                  {ex.breakdown.map((part, j) => (
                    <ColoredWord
                      key={j}
                      word={part.word}
                      role={part.role}
                      meaning={part.meaning}
                      isArabic
                    />
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-sm text-center text-muted-foreground italic mb-1">{ex.transliteration}</p>
                  <p className="text-sm text-center font-medium text-foreground">{ex.english}</p>
                </div>
                <div className="flex flex-row-reverse flex-wrap gap-2 mt-3 justify-center">
                  {ex.breakdown.map((part, j) => (
                    <span
                      key={j}
                      className={`bg-role-${part.role} role-${part.role} text-xs px-2 py-0.5 rounded`}
                    >
                      {ROLE_LABELS[part.role] ?? part.role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Preposition Table */}
        {lesson.prepositionList && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Prepositions Table</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Arabic</th>
                    <th className="text-left px-4 py-3 font-semibold">Transliteration</th>
                    <th className="text-left px-4 py-3 font-semibold">Meaning</th>
                    <th className="text-left px-4 py-3 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.prepositionList.map((prep, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3"><ArabicText size="md">{prep.arabic}</ArabicText></td>
                      <td className="px-4 py-3 text-muted-foreground">{prep.transliteration}</td>
                      <td className="px-4 py-3 font-medium">{prep.english}</td>
                      <td className="px-4 py-3">
                        <ArabicText size="sm">{prep.example}</ArabicText>
                        <span className="text-xs text-muted-foreground ml-2">({prep.exampleEnglish})</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {/* Conjugation Table — shown when lesson covers it */}

        {/* Conjugation Chart (فَعَلَ pattern) */}
        {lesson.conjugationChart && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-1">
              <Grid3X3 className="w-5 h-5 text-primary" />
              {lesson.conjugationChart.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              <MixedText>{lesson.conjugationChart.subtitle}</MixedText>
            </p>
            <div className="overflow-x-auto rounded-xl border border-border mb-4">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-3 font-semibold">Person</th>
                    <th className="text-left px-3 py-3 font-semibold">Pronoun (Ar)</th>
                    <th className="text-left px-3 py-3 font-semibold">Pronoun (En)</th>
                    <th className="text-left px-3 py-3 font-semibold">Number</th>
                    <th className="text-left px-3 py-3 font-semibold">Gender</th>
                    <th className="text-left px-3 py-3 font-semibold">Form</th>
                    <th className="text-left px-3 py-3 font-semibold">Ending</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.conjugationChart.rows.map((row, i) => {
                    const rowBg =
                      row.person === '3rd'
                        ? 'bg-blue-50 dark:bg-blue-950/20'
                        : row.person === '2nd'
                        ? 'bg-amber-50 dark:bg-amber-950/20'
                        : 'bg-emerald-50 dark:bg-emerald-950/20';
                    const genderAr =
                      row.gender === 'M'   ? 'مُذَكَّر' :
                      row.gender === 'F'   ? 'مُؤَنَّث' :
                                            'مُذَكَّر / مُؤَنَّث';
                    return (
                      <tr key={i} className={`border-t border-border ${rowBg}`}>
                        <td className="px-3 py-2.5 text-xs font-medium text-muted-foreground">{row.person} ({row.personAr})</td>
                        <td className="px-3 py-2.5"><ArabicText size="sm">{row.pronoun}</ArabicText></td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.pronounEn}</td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{row.number}</td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                          {row.gender} (<ArabicText size="sm" className="inline text-foreground">{genderAr}</ArabicText>)
                        </td>
                        <td className="px-3 py-2.5"><ArabicText size="lg" className="text-primary font-bold">{row.form}</ArabicText></td>
                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{row.ending}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Tips</p>
              <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-500">•</span>
                  <MixedText>Look for تَ/تِ/تُ → always 2nd or 1st person</MixedText>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-500">•</span>
                  <MixedText>Dual (two people) always has ا or مَا sound</MixedText>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-500">•</span>
                  <MixedText>هُوَ = base form, add suffixes for everyone else</MixedText>
                </li>
              </ul>
            </div>
          </motion.section>
        )}

        {/* Pronoun Tables */}
        {lesson.pronounTable && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Pronoun Tables</h2>
            <div className="overflow-x-auto rounded-xl border border-border mb-4">
              <div className="px-4 py-2 bg-muted/50 font-semibold text-sm">Detached Pronouns (مُنْفَصِلٌ)</div>
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold">Arabic</th>
                    <th className="text-left px-4 py-2 font-semibold">Transliteration</th>
                    <th className="text-left px-4 py-2 font-semibold">English</th>
                    <th className="text-left px-4 py-2 font-semibold">Person</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.pronounTable.detached.map((row, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-2"><ArabicText size="md">{row.pronoun}</ArabicText></td>
                      <td className="px-4 py-2 text-muted-foreground italic">{row.transliteration}</td>
                      <td className="px-4 py-2">{row.english}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{row.person} {row.gender} {row.number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <div className="px-4 py-2 bg-muted/50 font-semibold text-sm">Attached Pronouns (مُتَّصِلٌ)</div>
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold">Suffix</th>
                    <th className="text-left px-4 py-2 font-semibold">English</th>
                    <th className="text-left px-4 py-2 font-semibold">Noun Example</th>
                    <th className="text-left px-4 py-2 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.pronounTable.attached.map((row, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-2"><ArabicText size="md" className="text-primary font-bold">{row.suffix}</ArabicText></td>
                      <td className="px-4 py-2">{row.english}</td>
                      <td className="px-4 py-2"><ArabicText size="sm">{row.nounExample}</ArabicText></td>
                      <td className="px-4 py-2 text-muted-foreground">{row.nounMeaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {/* Imperative Table — shown when Lesson 9 is covered */}

        {/* Plural Table */}
        {lesson.pluralTable && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Singular, Dual & Plural Forms</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Singular</th>
                    <th className="text-left px-4 py-3 font-semibold">Dual</th>
                    <th className="text-left px-4 py-3 font-semibold">Plural</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.pluralTable.map((row, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-2.5">
                        <ArabicText size="md">{row.singular}</ArabicText>
                        <div className="text-xs text-muted-foreground">{row.singularEnglish}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <ArabicText size="sm" className="text-blue-600 dark:text-blue-400">{row.dual}</ArabicText>
                      </td>
                      <td className="px-4 py-2.5">
                        <ArabicText size="sm" className="text-purple-600 dark:text-purple-400">
                          {row.soundMascPlural ?? row.soundFemPlural ?? row.brokenPlural ?? '—'}
                        </ArabicText>
                        {row.brokenPlural && (row.soundMascPlural || row.soundFemPlural) && (
                          <ArabicText size="sm" className="block text-muted-foreground">{row.brokenPlural}</ArabicText>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {/* Vocabulary */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Vocabulary
            <span className="ml-2 text-sm font-normal text-muted-foreground">({lessonVocabulary.length} words)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {lessonVocabulary.map((word, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-3 text-center">
                <ArabicText size="md" className="block mb-1">{word.arabic}</ArabicText>
                <div className="text-xs text-muted-foreground italic mb-0.5">{word.transliteration}</div>
                <div className="text-xs font-medium text-foreground">{word.english}</div>
                {word.plural && (
                  <div className="text-xs text-muted-foreground mt-1">pl. <span style={{ fontFamily: "'Amiri', serif" }}>{word.plural}</span></div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Exercises */}
        {lesson.exercises && lesson.exercises.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <div className="flex items-center gap-2 mb-4">
              <PenLine className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Exercises</h2>
            </div>
            <div className="space-y-5">
              {lesson.exercises.map(ex => (
                <div key={ex.number} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Exercise {ex.number}
                    </span>
                    <MixedText className="text-sm text-muted-foreground" arabicClassName="text-[1.2em]">{ex.instruction}</MixedText>
                  </div>
                  <ol className="space-y-2.5">
                    {ex.items.map(item => (
                      <li key={item.number} className="flex gap-3 items-baseline">
                        <span className="text-muted-foreground font-medium w-6 flex-shrink-0 text-sm">{item.number}.</span>
                        {/[؀-ۿ]/.test(item.text) ? (
                          <MixedText
                            className="text-foreground leading-relaxed"
                            arabicClassName="text-[1.35em]"
                          >
                            {item.text}
                          </MixedText>
                        ) : (
                          <span className="text-foreground leading-relaxed text-sm">{item.text}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Quranic Example */}
        {lesson.quranicExample && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Quranic Example</span>
              </div>
              <ArabicText size="2xl" className="block text-center mb-2 text-foreground">
                {lesson.quranicExample.arabic}
              </ArabicText>
              <p className="text-center text-sm text-muted-foreground italic mb-1">
                {lesson.quranicExample.transliteration}
              </p>
              <p className="text-center text-sm font-medium text-foreground mb-2">
                "{lesson.quranicExample.english}"
              </p>
              <p className="text-center text-xs text-muted-foreground">
                — <MixedText>{lesson.quranicExample.source}</MixedText>
              </p>
            </div>
          </motion.section>
        )}

        {/* Complete + Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border"
        >
          {prev ? (
            <Link
              href={`/lessons/${prev.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Lesson {prev.lessonNumber}: {prev.title}</span>
            </Link>
          ) : <div />}

          <button
            onClick={() => markLessonComplete(lesson.id)}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Completed!' : 'Mark Complete (+50 XP)'}
          </button>

          {next ? (
            <Link
              href={`/lessons/${next.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Lesson {next.lessonNumber}: {next.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </motion.div>
      </div>
    </div>
  );
}
