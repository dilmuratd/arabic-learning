import { Fragment } from 'react';
import { cn } from '@/lib/utils';

// Split on Arabic runs (letters + diacritics). Using two separate regexes
// avoids the stateful `lastIndex` bug when calling .test() on a /g regex.
const ARABIC_SPLIT = /([؀-ۿ‌-‏‪-‮ﭐ-﷿ﹰ-﻿]+)/g;
const IS_ARABIC   = /[؀-ۿ‌-‏‪-‮ﭐ-﷿ﹰ-﻿]/;
// Matches segments that are purely combining diacritics with no base letter.
const ONLY_DIACRITICS = /^[ؐ-ًؚ-ٟ]+$/;
// Matches whitespace-only segments (used to detect spaces between Arabic words)
const ONLY_SPACES = /^\s+$/;

interface MixedTextProps {
  children: string;
  className?: string;
  arabicClassName?: string;
}

/**
 * Renders a string that may contain both Latin and Arabic text.
 * Arabic runs are wrapped in a span with Amiri font so harakat and
 * Arabic letters render correctly inside otherwise-Latin paragraphs.
 *
 * Consecutive Arabic words separated only by whitespace are merged into
 * a single RTL span so multi-word Arabic sentences flow right-to-left.
 */
export function MixedText({ children, className, arabicClassName }: MixedTextProps) {
  const raw = children.split(ARABIC_SPLIT);

  // Merge Arabic runs that are separated only by whitespace into single RTL blocks.
  // e.g. ["نَصَرَ", " ", "حَامِدٌ", " ", "مَحْمُودًا"] → ["نَصَرَ حَامِدٌ مَحْمُودًا"]
  const parts: string[] = [];
  let i = 0;
  while (i < raw.length) {
    const part = raw[i];
    if (IS_ARABIC.test(part)) {
      let combined = part;
      let j = i + 1;
      // Keep consuming as long as the next chunk is whitespace-only followed by Arabic
      while (
        j < raw.length &&
        ONLY_SPACES.test(raw[j]) &&
        j + 1 < raw.length &&
        IS_ARABIC.test(raw[j + 1])
      ) {
        combined += raw[j] + raw[j + 1];
        j += 2;
      }
      parts.push(combined);
      i = j;
    } else {
      parts.push(part);
      i++;
    }
  }

  return (
    <span className={className} dir="ltr">
      {parts.map((part, idx) => {
        if (!IS_ARABIC.test(part)) return <Fragment key={idx}>{part}</Fragment>;

        // Diacritic-only segments (e.g. standalone ُ or ٌ) have no base letter.
        if (ONLY_DIACRITICS.test(part)) {
          return (
            <span
              key={idx}
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
            key={idx}
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
