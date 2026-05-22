import { Fragment } from 'react';
import { cn } from '@/lib/utils';

// Split on Arabic runs (letters + diacritics). Using two separate regexes
// avoids the stateful `lastIndex` bug when calling .test() on a /g regex.
const ARABIC_SPLIT = /([؀-ۿ‌-‏‪-‮ﭐ-﷿ﹰ-﻿]+)/g;
const IS_ARABIC   = /[؀-ۿ‌-‏‪-‮ﭐ-﷿ﹰ-﻿]/;
// Matches segments that are purely combining diacritics with no base letter.
// These marks (U+064B–U+065F, U+0610–U+061A) need a base glyph to attach to.
const ONLY_DIACRITICS = /^[ؐ-ًؚ-ٟ]+$/;

interface MixedTextProps {
  children: string;
  className?: string;
  arabicClassName?: string;
}

/**
 * Renders a string that may contain both Latin and Arabic text.
 * Arabic runs are wrapped in a span with Amiri font so harakat and
 * Arabic letters render correctly inside otherwise-Latin paragraphs.
 */
export function MixedText({ children, className, arabicClassName }: MixedTextProps) {
  const parts = children.split(ARABIC_SPLIT);

  return (
    <span className={className} dir="ltr">
      {parts.map((part, i) => {
        if (!IS_ARABIC.test(part)) return <Fragment key={i}>{part}</Fragment>;

        // Diacritic-only segments (e.g. standalone ُ or ٌ) have no base letter.
        // Render as inline-block so the combining mark can't leak across the element
        // boundary onto surrounding Latin characters. A tatweel provides the base glyph.
        if (ONLY_DIACRITICS.test(part)) {
          return (
            <span
              key={i}
              className={cn('arabic-text text-[1.15em] leading-none px-0.5', arabicClassName)}
              style={{
                fontFamily: "'Amiri', 'Traditional Arabic', serif",
                display: 'inline-block',
              }}
            >
              {'ـ'}{part}
            </span>
          );
        }

        return (
          <span
            key={i}
            className={cn('arabic-text inline text-[1.15em] leading-none px-0.5', arabicClassName)}
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", unicodeBidi: 'isolate' }}
            dir="rtl"
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}
