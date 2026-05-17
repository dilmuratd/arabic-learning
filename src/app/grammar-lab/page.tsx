'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Info, Plus, Trash2 } from 'lucide-react';
import { ArabicText } from '@/components/ArabicText';
import { MixedText } from '@/components/MixedText';
import { ColoredWord } from '@/components/GrammarBadge';
import lessonsData from '@/data/lessons.json';
import type { Lesson, Example } from '@/types';

const lessons = lessonsData as Lesson[];

// Collect all examples from all lessons
const ALL_EXAMPLES: (Example & { lessonTitle: string; lessonId: number })[] = lessons.flatMap(l =>
  l.examples.map(ex => ({ ...ex, lessonTitle: l.title, lessonId: l.id }))
);

const GRAMMAR_ROLES = [
  { role: 'mubtada', label: 'Mubtada (Subject)', arabic: 'مُبْتَدَأٌ' },
  { role: 'khabar', label: 'Khabar (Predicate)', arabic: 'خَبَرٌ' },
  { role: 'verb', label: "Fiʿl (Verb)", arabic: 'فِعْلٌ' },
  { role: 'faail', label: "Fā'il (Subject of verb)", arabic: 'فَاعِلٌ' },
  { role: 'mafool', label: "Maf'ūl (Object)", arabic: 'مَفْعُولٌ' },
  { role: 'mudaaf', label: 'Muḍāf', arabic: 'مُضَافٌ' },
  { role: 'mudaaf-ilayhi', label: 'Muḍāf Ilayhi', arabic: 'مُضَافٌ إِلَيْهِ' },
  { role: 'jar-majroor', label: 'Jār-Majrūr', arabic: 'جَارٌّ وَمَجْرُورٌ' },
  { role: 'sifa', label: 'Ṣifa (Adjective)', arabic: 'صِفَةٌ' },
  { role: 'mawsoof', label: 'Mawṣūf (Described noun)', arabic: 'مَوْصُوفٌ' },
];

// Sentence builder word bank
const WORD_BANK = [
  { arabic: 'ذَهَبَ', role: 'verb', english: 'went' },
  { arabic: 'كَتَبَ', role: 'verb', english: 'wrote' },
  { arabic: 'الطَّالِبُ', role: 'faail', english: 'the student' },
  { arabic: 'مُحَمَّدٌ', role: 'faail', english: 'Muhammad' },
  { arabic: 'رِسَالَةً', role: 'mafool', english: 'a letter' },
  { arabic: 'كِتَاباً', role: 'mafool', english: 'a book' },
  { arabic: 'إِلَى الْمَسْجِدِ', role: 'jar-majroor', english: 'to the mosque' },
  { arabic: 'إِلَى الْمَدْرَسَةِ', role: 'jar-majroor', english: 'to school' },
  { arabic: 'الْبَيْتُ', role: 'mubtada', english: 'the house' },
  { arabic: 'كَبِيرٌ', role: 'khabar', english: 'large' },
  { arabic: 'جَمِيلٌ', role: 'khabar', english: 'beautiful' },
  { arabic: 'كِتَابُ', role: 'mudaaf', english: 'book of' },
  { arabic: 'الطَّالِبِ', role: 'mudaaf-ilayhi', english: 'the student\'s' },
];

interface BuiltWord {
  arabic: string;
  role: string;
  english: string;
}

export default function GrammarLabPage() {
  const [selectedExample, setSelectedExample] = useState<typeof ALL_EXAMPLES[0] | null>(null);
  const [builtSentence, setBuiltSentence] = useState<BuiltWord[]>([]);
  const [activeTab, setActiveTab] = useState<'explorer' | 'builder'>('explorer');

  const addWord = (word: BuiltWord) => {
    setBuiltSentence(prev => [...prev, word]);
  };

  const removeWord = (index: number) => {
    setBuiltSentence(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Beaker className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Grammar Lab</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Explore sentence structures visually with color-coded grammar roles.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['explorer', 'builder'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {tab === 'explorer' ? 'Example Explorer' : 'Sentence Builder'}
            </button>
          ))}
        </div>

        {activeTab === 'explorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Example list */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Select an Example
              </h3>
              {ALL_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedExample(ex)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    selectedExample === ex
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {ex.lessonTitle}
                  </div>
                  <ArabicText size="sm" className="block text-foreground">
                    {ex.arabic}
                  </ArabicText>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {ex.english}
                  </div>
                </button>
              ))}
            </div>

            {/* Visualization panel */}
            <div className="lg:col-span-2">
              {selectedExample ? (
                <motion.div
                  key={selectedExample.arabic}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-foreground mb-4">Sentence Analysis</h3>

                  {/* Full Arabic sentence */}
                  <div className="bg-muted/30 rounded-xl p-4 mb-6 text-center">
                    <ArabicText size="2xl" className="block mb-2">
                      {selectedExample.arabic}
                    </ArabicText>
                    <p className="text-sm text-muted-foreground italic">{selectedExample.transliteration}</p>
                    <p className="text-sm font-medium text-foreground mt-1">{selectedExample.english}</p>
                  </div>

                  {/* Color-coded breakdown */}
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground mb-3 font-medium">WORD-BY-WORD BREAKDOWN</p>
                    <div className="flex flex-row-reverse flex-wrap items-end gap-2 justify-center">
                      {selectedExample.breakdown.map((part, j) => (
                        <ColoredWord
                          key={j}
                          word={part.word}
                          role={part.role}
                          meaning={part.meaning}
                          isArabic
                        />
                      ))}
                    </div>
                  </div>

                  {/* Role legend */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-3 font-medium">GRAMMAR ROLES</p>
                    <div className="space-y-2">
                      {selectedExample.breakdown.map((part, j) => {
                        const roleInfo = GRAMMAR_ROLES.find(r => r.role === part.role);
                        return (
                          <div key={j} className="flex items-center gap-3">
                            <span className={`bg-role-${part.role} role-${part.role} text-xs px-2 py-1 rounded font-medium min-w-20 text-center`}>
                              {roleInfo?.label ?? part.role}
                            </span>
                            <ArabicText size="sm" className="text-foreground">{part.word}</ArabicText>
                            <span className="text-sm text-muted-foreground">= {part.meaning}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-muted/30 rounded-2xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
                  <Info className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Select an example from the list to see its grammar analysis.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Build Your Sentence</h3>

              {/* Built sentence display */}
              <div className="min-h-24 bg-muted/30 rounded-xl p-4 mb-4 flex flex-row-reverse flex-wrap items-end gap-2 justify-center">
                {builtSentence.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Click words below to build a sentence</p>
                ) : (
                  builtSentence.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => removeWord(i)}
                      title="Remove"
                      className="relative group"
                    >
                      <ColoredWord word={w.arabic} role={w.role} meaning={w.english} isArabic />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">×</span>
                    </button>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setBuiltSentence([])}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors border border-border"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Word bank */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Word Bank — click to add
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {WORD_BANK.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => addWord(w)}
                    className={`bg-role-${w.role} text-left rounded-xl p-3 hover:opacity-80 transition-opacity border border-transparent hover:border-border`}
                  >
                    <ArabicText size="md" className={`role-${w.role} block mb-1`}>
                      {w.arabic}
                    </ArabicText>
                    <div className="text-xs text-muted-foreground">{w.english}</div>
                    <div className={`text-xs role-${w.role} mt-1 opacity-70`}>{w.role}</div>
                    <Plus className="w-3.5 h-3.5 text-muted-foreground mt-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Grammar role legend */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Grammar Role Legend</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GRAMMAR_ROLES.map(r => (
                  <div key={r.role} className="flex items-center gap-3">
                    <span className={`bg-role-${r.role} role-${r.role} text-xs px-2.5 py-1 rounded font-medium w-32 text-center`}>
                      {r.label.split(' ')[0]}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{r.label}</div>
                      <ArabicText size="sm" className="text-muted-foreground">{r.arabic}</ArabicText>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
