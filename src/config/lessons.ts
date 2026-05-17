// Toggle lessons on/off as you progress through the course.
// Set a lesson to `true` to make it visible, `false` to hide it.
export const LESSON_FLAGS: Record<string, boolean> = {
  'mubtada-khabar':        true,   // Lesson 1 — Subject and Predicate
  'mudaaf-mudaaf-ilayhi':  true,   // Lesson 2 — Possessive Construction
  'past-tense':            false,  // Lesson 3 — Past Tense Verb
  'fail-mafool':           false,  // Lesson 4 — Verb, Subject, Object
  'prepositions':          false,  // Lesson 5 — Prepositions
  'pronouns':              false,  // Lesson 6 — Pronouns
  'present-tense':         false,  // Lesson 7 — Present & Future Tense
  'adjectives':            false,  // Lesson 8 — Adjective
  'imperatives':           false,  // Lesson 9 — Imperative & Prohibitive
  'singular-dual-plural':  false,  // Lesson 10 — Singular, Dual & Plural
};

export function isLessonEnabled(slug: string): boolean {
  return LESSON_FLAGS[slug] ?? false;
}
