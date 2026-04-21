interface QuestionDisplayProps {
  question: string;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <section className="glass-card p-6 text-center">
      <h1 className="text-3xl font-extrabold">{question}</h1>
      <p className="mt-2 text-white/80">Đồng hồ đếm ngược và đáp án sẽ cập nhật realtime từ host.</p>
    </section>
  );
}
