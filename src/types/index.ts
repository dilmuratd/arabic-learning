export interface WordBreakdown {
  word: string;
  role: string;
  meaning: string;
}

export interface Example {
  arabic: string;
  transliteration: string;
  english: string;
  breakdown: WordBreakdown[];
}

export interface VocabularyWord {
  arabic: string;
  transliteration: string;
  english: string;
}

export interface Concept {
  term: string;
  transliteration: string;
  english: string;
  color: string;
  description: string;
}

export interface ConjugationRow {
  pronoun: string;
  form: string;
  transliteration: string;
  english: string;
  person: string;
  gender: string;
  number: string;
}

export interface Lesson {
  id: number;
  slug: string;
  title: string;
  arabicTitle: string;
  arabicTitleSimple: string;
  lessonNumber: number;
  description: string;
  color: string;
  icon: string;
  concepts: Concept[];
  rules: string[];
  examples: Example[];
  vocabulary: VocabularyWord[];
  quranicExample?: {
    arabic: string;
    transliteration: string;
    english: string;
    source: string;
  };
  conjugationTable?: {
    active: ConjugationRow[];
    passive: ConjugationRow[];
  };
  prepositionList?: Array<{
    arabic: string;
    transliteration: string;
    english: string;
    example: string;
    exampleEnglish: string;
  }>;
  pronounTable?: {
    detached: Array<{
      pronoun: string;
      transliteration: string;
      english: string;
      person: string;
      gender: string;
      number: string;
    }>;
    attached: Array<{
      suffix: string;
      transliteration: string;
      english: string;
      person: string;
      gender: string;
      number: string;
      nounExample: string;
      nounMeaning: string;
    }>;
  };
  imperativeTable?: Array<{
    pronoun: string;
    presentForm: string;
    imperative: string;
    transliteration: string;
    english: string;
    prohibitive: string;
    prohibitiveEnglish: string;
  }>;
  pluralTable?: Array<{
    singular: string;
    singularEnglish: string;
    dual: string;
    soundMascPlural?: string;
    soundFemPlural?: string;
    brokenPlural?: string;
  }>;
  exercises?: Exercise[];
  grammarPoints?: Array<{
    title: string;
    explanation: string;
    examples: string[];
  }>;
  conjugationChart?: {
    title: string;
    subtitle: string;
    rows: Array<{
      person: string;
      personAr: string;
      pronoun: string;
      pronounEn: string;
      form: string;
      ending: string;
      gender: string;
      number: string;
    }>;
  };
  passiveConjugationChart?: {
    title: string;
    subtitle: string;
    rows: Array<{
      person: string;
      personAr: string;
      pronoun: string;
      pronounEn: string;
      form: string;
      ending: string;
      gender: string;
      number: string;
    }>;
  };
}

export interface ExerciseItem {
  number: number;
  text: string;
  direction: 'translate-to-arabic' | 'translate-to-english' | 'read-arabic';
  answer?: string;
}

export interface Exercise {
  number: number;
  instruction: string;
  items: ExerciseItem[];
}

export interface FlashCard {
  id: number;
  arabic: string;
  transliteration: string;
  english: string;
  plural?: string;
  lesson: number;
  category: string;
}

export interface Quiz {
  id: string;
  lessonId: number;
  type: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface UserProgress {
  completedLessons: number[];
  lessonProgress: Record<number, number>;
  quizScores: Record<string, number>;
  flashcardsSeen: number[];
  flashcardsLearned: number[];
  streakDays: number;
  lastStudied: string | null;
  totalXP: number;
  badges: string[];
}
