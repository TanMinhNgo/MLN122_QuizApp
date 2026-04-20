interface QuestionListProps {
  title: string;
  quizId: string;
  questions: string[];
  activeIndex: number;
}

export function QuestionList({ title, quizId, questions, activeIndex }: QuestionListProps) {
  return (
    <aside className="glass-card p-4">
      <h1 className="text-xl font-extrabold">{title}</h1>
      <p className="mt-1 text-sm text-white/80">Quiz ID: {quizId}</p>

      <div className="mt-4 max-h-[55vh] space-y-2 overflow-auto pr-1">
        {questions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/25 p-3 text-sm text-white/70">
            Chưa có câu hỏi.
          </p>
        ) : (
          questions.map((question, index) => (
            <button
              key={`question-${index}`}
              type="button"
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                index === activeIndex
                  ? "bg-[var(--accent)] font-semibold"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Câu {index + 1}: {question.slice(0, 30)}
            </button>
          ))
        )}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/25"
      >
        Thêm câu hỏi
      </button>
    </aside>
  );
}
