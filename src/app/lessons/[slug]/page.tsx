import lessonsData from '@/data/lessons.json';
import type { Lesson } from '@/types';
import LessonDetail from './LessonDetail';

const lessons = lessonsData as Lesson[];

export function generateStaticParams() {
  return lessons.map(l => ({ slug: l.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LessonDetail slug={slug} />;
}
