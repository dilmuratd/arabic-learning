'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ArabicText } from '@/components/ArabicText';
import conjugationsData from '@/data/conjugations.json';

const { verbs, pastSuffixes, presentPrefixes } = conjugationsData;

type Voice = 'active' | 'passive';
type Tense = 'past' | 'present' | 'imperative';

// Conjugate past active for a given verb base
function conjugatePast(base: string, voice: Voice): { pronoun: string; form: string; transliteration: string; english: string }[] {
  const verb = verbs.find(v => v.pastBase === base) ?? verbs[0];
  return pastSuffixes.active.map(row => {
    let form = verb.pastBase;
    if (voice === 'passive') {
      // Transform: first vowel → dammah, vowel before last letter → kasrah
      form = form.replace(/^(.)َ/, '$1ُ').replace(/َ([^َُِ])$/, 'ِ$1');
    }
    return {
      pronoun: row.pronoun,
      form: form + row.suffix,
      transliteration: `${verb.pastBase.replace(/[^؀-ۿ]/g, '')}${row.suffix}`,
      english: `${row.english} ${voice === 'passive' ? 'was helped' : verb.english.split(' ')[1] ?? 'helped'}`,
    };
  });
}

// Conjugate present active for a given verb base
function conjugatePresent(presentBase: string, voice: Voice): { pronoun: string; form: string; english: string }[] {
  return presentPrefixes.active.map(row => {
    let form = row.prefix + presentBase.slice(1) + row.suffix.replace(/^ُ/, '');
    // For passive: prefix vowel → dammah, vowel before last → fathah
    if (voice === 'passive') {
      form = 'يُ' + presentBase.slice(2).replace(/ُ$/, 'َ');
    }
    return {
      pronoun: row.pronoun,
      form: voice === 'active'
        ? row.prefix + presentBase.slice(1, -1) + row.suffix
        : row.prefix.replace('يَ', 'يُ').replace('تَ', 'تُ').replace('أَ', 'أُ').replace('نَ', 'نُ') + presentBase.slice(1, -1) + row.suffix,
      english: `${row.english} ${presentBase.slice(0, 3)}`,
    };
  });
}

const PERSON_COLORS: Record<string, string> = {
  '3rd': 'bg-blue-50 dark:bg-blue-950/30',
  '2nd': 'bg-amber-50 dark:bg-amber-950/30',
  '1st': 'bg-emerald-50 dark:bg-emerald-950/30',
};

// Pre-computed full conjugation tables from JSON data
function buildPastTable(verbIdx: number, voice: Voice) {
  return pastSuffixes.active.map(row => {
    const base = voice === 'active' ? verbs[verbIdx].pastBase : verbs[verbIdx].pastBase
      .replace(/^([؀-ۿ])َ/, '$1ُ')
      .replace(/َ([؀-ۿ])$/, 'ِ$1');
    return { ...row, form: base + row.suffix };
  });
}

function buildPresentTable(verbIdx: number, voice: Voice) {
  const base = verbs[verbIdx].presentBase;
  return presentPrefixes.active.map(row => {
    const prefix = voice === 'passive'
      ? row.prefix.replace(/َ$/, 'ُ')
      : row.prefix;
    const stem = base.slice(1).replace(/[ُِ]$/, ''); // remove last vowel
    const suffix = voice === 'passive'
      ? row.suffix.replace(/^ُ/, 'َ')
      : row.suffix;
    return { ...row, form: prefix + stem + suffix };
  });
}

export default function ConjugationPage() {
  const [selectedVerbIdx, setSelectedVerbIdx] = useState(0);
  const [voice, setVoice] = useState<Voice>('active');
  const [tense, setTense] = useState<Tense>('past');

  const verb = verbs[selectedVerbIdx];
  const pastRows = useMemo(() => buildPastTable(selectedVerbIdx, voice), [selectedVerbIdx, voice]);
  const presentRows = useMemo(() => buildPresentTable(selectedVerbIdx, voice), [selectedVerbIdx, voice]);

  const rows = tense === 'past' ? pastRows : presentRows;

  // Group by person
  const grouped = {
    '3rd': rows.filter(r => r.person === '3rd'),
    '2nd': rows.filter(r => r.person === '2nd'),
    '1st': rows.filter(r => r.person === '1st'),
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Verb Conjugation</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Interactive conjugation tables for all verb forms.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Verb selector */}
          <div className="flex-1 min-w-52">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              Select Verb
            </label>
            <div className="flex flex-wrap gap-2">
              {verbs.map((v, i) => (
                <button
                  key={v.root}
                  onClick={() => setSelectedVerbIdx(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedVerbIdx === i
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <span className="arabic-text text-base mr-1">{v.pastBase}</span>
                  <span className="text-xs opacity-70">({v.english.split(' ').slice(1).join(' ')})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verb info card */}
        <motion.div
          key={verb.root}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs text-muted-foreground font-semibold mb-1">ROOT: {verb.root}</div>
              <ArabicText size="3xl" className="block text-primary mb-1">{verb.pastBase}</ArabicText>
              <ArabicText size="xl" className="block text-muted-foreground">{verb.presentBase}</ArabicText>
            </div>
            <div className="text-right">
              <div className="font-bold text-foreground text-lg">{verb.english}</div>
              <div className="text-sm text-muted-foreground">{verb.pattern}</div>
              <div className="text-xs text-muted-foreground capitalize">{verb.type} verb</div>
            </div>
          </div>
        </motion.div>

        {/* Tense & Voice toggles */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            {(['past', 'present'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTense(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tense === t ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'past' ? 'Past (مَاضٍ)' : 'Present (مُضَارِعٌ)'}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            {(['active', 'passive'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  voice === v ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {v === 'active' ? 'Active (مَعْرُوفٌ)' : 'Passive (مَجْهُولٌ)'}
              </button>
            ))}
          </div>
        </div>

        {/* Conjugation Table */}
        <motion.div
          key={`${verb.root}-${tense}-${voice}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {(['3rd', '2nd', '1st'] as const).map(person => (
            <div key={person} className={`rounded-2xl overflow-hidden border border-border ${PERSON_COLORS[person]}`}>
              <div className="px-4 py-2 bg-white/50 dark:bg-black/20 border-b border-border">
                <span className="text-sm font-semibold text-foreground">
                  {person === '3rd' ? 'Third Person (غَائِبٌ)' : person === '2nd' ? 'Second Person (مُخَاطَبٌ)' : 'First Person (مُتَكَلِّمٌ)'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Pronoun</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Gender</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Number</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Verb Form</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">English</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[person].map((row, i) => (
                      <tr key={i} className="border-t border-border/30 hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-2.5">
                          <ArabicText size="md">{row.pronoun}</ArabicText>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground capitalize">{row.gender}</td>
                        <td className="px-4 py-2.5 text-muted-foreground capitalize">{row.number}</td>
                        <td className="px-4 py-2.5">
                          <ArabicText size="lg" className="font-bold text-primary">{row.form}</ArabicText>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.english}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pattern note */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
          <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Pattern: {verb.pattern}</div>
          <p className="text-amber-600 dark:text-amber-400 text-xs">
            {tense === 'past' && voice === 'active' && 'Active past: use the base form + suffix for each person/gender/number.'}
            {tense === 'past' && voice === 'passive' && 'Passive past: change first vowel to ضَمَّة and vowel before last letter to كَسْرَة, then add same suffixes.'}
            {tense === 'present' && voice === 'active' && 'Active present: add one of four prefixes (أَنَيْتُ) + root + suffix.'}
            {tense === 'present' && voice === 'passive' && 'Passive present: prefix vowel becomes ضَمَّة and vowel before last letter becomes فَتْحَة.'}
          </p>
        </div>
      </div>
    </div>
  );
}
