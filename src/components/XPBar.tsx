'use client';

import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

interface XPBarProps {
  xp: number;
  completedLessons: number;
  totalLessons: number;
}

export function XPBar({ xp, completedLessons, totalLessons }: XPBarProps) {
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-1.5 shrink-0">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="text-sm font-bold text-foreground">Lv. {level}</span>
      </div>
      <div className="flex-1 min-w-0">
        <Progress value={xpInLevel} className="h-2" />
      </div>
      <div className="text-xs text-muted-foreground shrink-0">{xp} XP</div>
      <div className="text-xs text-muted-foreground shrink-0 border-l border-border pl-3">
        {completedLessons}/{totalLessons} lessons
      </div>
    </div>
  );
}
