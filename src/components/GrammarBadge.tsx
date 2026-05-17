import { cn } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = {
  mubtada: 'Mubtada (Subject)',
  khabar: 'Khabar (Predicate)',
  verb: 'Fiʿl (Verb)',
  faail: "Fā'il (Subject)",
  mafool: "Maf'ūl (Object)",
  mudaaf: 'Muḍāf',
  'mudaaf-ilayhi': 'Muḍāf Ilayhi',
  'jar-majroor': 'Jār-Majrūr',
  sifa: 'Ṣifa (Adjective)',
  mawsoof: 'Mawṣūf (Noun)',
  'nahy-particle': 'Lā (Prohibition)',
};

interface GrammarBadgeProps {
  role: string;
  className?: string;
  showLabel?: boolean;
}

export function GrammarBadge({ role, className, showLabel = true }: GrammarBadgeProps) {
  return (
    <span
      className={cn(
        `bg-role-${role} role-${role}`,
        'px-2 py-0.5 rounded text-xs font-medium',
        className
      )}
    >
      {showLabel ? (ROLE_LABELS[role] ?? role) : role}
    </span>
  );
}

interface ColoredWordProps {
  word: string;
  role: string;
  meaning?: string;
  isArabic?: boolean;
}

export function ColoredWord({ word, role, meaning, isArabic = false }: ColoredWordProps) {
  return (
    <span className="inline-flex flex-col items-center gap-0.5 mx-1">
      <span
        className={cn(
          `bg-role-${role} role-${role}`,
          'px-2 py-1 rounded font-medium',
          isArabic && 'arabic-text text-2xl'
        )}
        title={meaning}
      >
        {word}
      </span>
      {meaning && (
        <span className="text-[10px] text-muted-foreground max-w-20 text-center leading-tight">
          {meaning}
        </span>
      )}
    </span>
  );
}
