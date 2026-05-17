import { cn } from '@/lib/utils';

interface ArabicTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
  '3xl': 'text-6xl',
  '4xl': 'text-7xl',
};

export function ArabicText({ children, className, size = 'md' }: ArabicTextProps) {
  return (
    <span
      className={cn('arabic-text font-normal', sizeMap[size], className)}
      style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
    >
      {children}
    </span>
  );
}
