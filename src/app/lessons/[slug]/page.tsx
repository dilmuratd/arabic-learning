import lessonsData from '@/data/lessons.json';
import type { Lesson } from '@/types';
import LessonDetail from './LessonDetail';
import { isLessonEnabled } from '@/config/lessons';
import Link from 'next/link';
import { Lock } from 'lucide-react';

const lessons = lessonsData as Lesson[];

export function generateStaticParams() {
  return lessons.map(l => ({ slug: l.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isLessonEnabled(slug)) {
    const lesson = lessons.find(l => l.slug === slug);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">{lesson?.title ?? 'Lesson'}</h1>
          <p className="text-muted-foreground text-sm mb-6">
            This lesson hasn&apos;t been unlocked yet. Check back as the course progresses.
          </p>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  return <LessonDetail slug={slug} />;
}
