import Link from 'next/link';

import { QuizEditor } from '@/components/host/QuizEditor';

interface EditQuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto mt-6 w-[min(1200px,calc(100%-2rem))]">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-sm font-semibold text-mln-dim transition hover:bg-white/10 hover:text-mln-cream"
      >
        ← Quay lại Dashboard
      </Link>
      <QuizEditor quizId={id} />
    </main>
  );
}
