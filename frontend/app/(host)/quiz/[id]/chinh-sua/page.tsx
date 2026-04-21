import { QuizEditor } from "@/components/host/QuizEditor";

interface EditQuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto mt-6 w-[min(1200px,calc(100%-2rem))]">
      <QuizEditor quizId={id} />

      <button
        type="button"
        className="fixed bottom-6 right-6 rounded-full bg-[var(--accent)] px-6 py-3 font-bold shadow-lg hover:brightness-110"
      >
        Lưu thay đổi
      </button>
    </main>
  );
}
