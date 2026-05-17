'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Layers, Zap, Trophy, ArrowRight, Star, Users, Clock } from 'lucide-react';
import { ArabicText } from '@/components/ArabicText';
import { XPBar } from '@/components/XPBar';
import { useProgress } from '@/hooks/useProgress';
import lessonsData from '@/data/lessons.json';

const FEATURES = [
  { icon: BookOpen, title: '10 Structured Lessons', desc: 'From Mubtada-Khabar to plural forms, covering all foundational grammar.' },
  { icon: Layers, title: 'Grammar Lab', desc: 'Visualize sentence structures with color-coded grammar role highlighting.' },
  { icon: Zap, title: 'Verb Conjugation', desc: 'Interactive conjugation tables for past, present, imperative and prohibitive.' },
  { icon: Trophy, title: 'Quizzes & Flashcards', desc: 'Test your knowledge and build vocabulary with spaced repetition.' },
];

const LESSON_HIGHLIGHTS = [
  { arabic: 'مُبْتَدَأٌ وَخَبَرٌ', english: 'Subject & Predicate', href: '/lessons/mubtada-khabar' },
  { arabic: 'مُضَافٌ وَمُضَافٌ إِلَيْهِ', english: 'Possessive Construction', href: '/lessons/mudaaf-mudaaf-ilayhi' },
  { arabic: 'فِعْلٌ مَاضٍ', english: 'Past Tense Verb', href: '/lessons/past-tense' },
  { arabic: 'فَاعِلٌ وَمَفْعُولٌ', english: 'Subject & Object', href: '/lessons/fail-mafool' },
  { arabic: 'حُرُوفٌ جَارَّةٌ', english: 'Prepositions', href: '/lessons/prepositions' },
  { arabic: 'الضَّمَائِرُ', english: 'Pronouns', href: '/lessons/pronouns' },
];

export default function HomePage() {
  const { progress, loaded } = useProgress();
  const totalLessons = lessonsData.length;

  return (
    <div className="min-h-screen">
      {/* Niyyah — Objectives for Learning and Teaching */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-2">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-700 dark:bg-emerald-800 px-6 py-5 text-center">
            <p className="text-white text-xl sm:text-2xl font-semibold">
              The Objectives for Learning and Teaching by Imām al-Ḥaddād
            </p>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Arabic */}
            <p
              className="arabic-text text-foreground leading-loose text-right"
              style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: 'clamp(1.15rem, 3.8vw, 1.6rem)' }}
              dir="rtl"
            >
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، نَوَيْتُ التَّعَلُّمَ وَالتَّعْلِيمَ، وَالتَّذَكُّرَ وَالتَّذْكِيرَ، وَالنَّفْعَ وَالانْتِفَاعَ، وَالإِفَادَةَ وَالاسْتِفَادَةَ، وَالْحَثَّ عَلَى التَّمَسُّكِ بِكِتَابِ اللَّهِ، وَسُنَّةِ رَسُولِهِ ﷺ، وَالدُّعَاءَ إِلَى الْهُدَى، وَالدَّلَالَةَ عَلَى الْخَيْرِ، ابْتِغَاءَ وَجْهِ اللَّهِ، وَمَرْضَاتِهِ، وَقُرْبِهِ، وَثَوَابِهِ سُبْحَانَهُ وَتَعَالَى.
            </p>

            <hr className="border-border" />

            {/* Transliteration */}
            <p className="text-sm text-muted-foreground italic leading-relaxed" dir="ltr">
              Alḥamdulillāhi rabbil ālamīn, nawaytut ta&apos;alluma watta&apos;līm, wattadhakkura wattadhkīra, wannaf&apos;a wal&apos;intifā&apos;a, wal&apos;ifādata wal&apos;istifādata, wal ḥath-tha &apos;alattamassuki bikitābillāhi, wa sunnati rasūlihī ﷺ, waddu&apos;ā&apos;a ilal hudā, waddalālata &apos;alal khayri, ibtighā&apos;a wajhillāhi wa marḍātihī wa qurbihī wa thawābihī subḥānahū wa ta&apos;ālā.
            </p>

            <hr className="border-border" />

            {/* English */}
            <p className="text-sm text-foreground leading-relaxed" dir="ltr">
              All praise to Allāh, Lord of all the Worlds. I intend to learn and to teach; to remember and to remind; to benefit (myself) and to benefit others; to take and give advantage; to encourage observance of the Book of Allāh and the Sunnah of His Messenger ﷺ; to call towards guidance; to direct towards the good; to seek (thereby) the Countenance of Allāh and His satisfaction, proximity and reward. Transcendent and Exalted is He.
            </p>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20 py-20 px-4">
        {/* Decorative Arabic calligraphy backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="arabic-text text-[20rem] font-bold text-emerald-500/5 dark:text-emerald-400/5 leading-none">
            ع
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Based on "Ten Lessons of Arabic"
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ArabicText size="4xl" className="block mb-4 text-emerald-700 dark:text-emerald-300 leading-none">
              تَعَلَّمِ الْعَرَبِيَّةَ
            </ArabicText>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Learn Arabic Grammar
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Interactive lessons based on the classic primer. Master the foundations of Arabic
              grammar through visual examples, conjugation tables, and hands-on exercises.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          >
            <Link
              href="/lessons"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/flashcards"
              className="inline-flex items-center justify-center gap-2 border border-border bg-background px-6 py-3 rounded-xl font-semibold hover:bg-accent transition-colors"
            >
              Practice Flashcards
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { icon: BookOpen, label: '10 Lessons' },
              { icon: Users, label: '60 Vocabulary Words' },
              { icon: Clock, label: '24 Quiz Questions' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Progress Bar (shown when user has progress) */}
      {loaded && progress.totalXP > 0 && (
        <section className="max-w-4xl mx-auto px-4 -mt-4">
          <XPBar
            xp={progress.totalXP}
            completedLessons={progress.completedLessons.length}
            totalLessons={totalLessons}
          />
        </section>
      )}

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">Everything You Need</h2>
          <p className="text-muted-foreground">Tools designed for structured Arabic grammar learning</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lesson Highlights */}
      <section className="bg-muted/40 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Lesson Topics</h2>
              <p className="text-muted-foreground text-sm">All 10 foundational grammar topics</p>
            </div>
            <Link
              href="/lessons"
              className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LESSON_HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.href}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={h.href}
                  className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <span className="text-sm font-medium text-foreground">{h.english}</span>
                  <ArabicText size="sm" className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {h.arabic.split('وَ')[0]}
                  </ArabicText>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quranic Examples callout */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8">
          <span
            className="arabic-text block mb-3 text-center whitespace-nowrap text-emerald-700 dark:text-emerald-300"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", fontSize: 'clamp(1.1rem, 5.5vw, 3rem)' }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <p className="text-muted-foreground text-sm mb-6">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
          <p className="text-foreground">
            Each lesson includes <strong>Quranic examples</strong> to connect grammar rules
            to the language of the Quran.
          </p>
        </div>
      </section>

    </div>
  );
}
