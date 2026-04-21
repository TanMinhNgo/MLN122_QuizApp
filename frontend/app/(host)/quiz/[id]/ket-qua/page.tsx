interface QuizResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizResultPage({ params }: QuizResultPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto mt-6 w-[min(900px,calc(100%-2rem))]">
      <section className="glass-card p-6">
        <h1 className="text-2xl font-extrabold">Kết quả quiz</h1>
        <p className="mt-1 text-white/80">Mã quiz: {id}</p>
        <p className="mt-4 text-white/80">Bảng kết quả chi tiết sẽ được tải từ API khi game kết thúc.</p>
      </section>
    </main>
  );
}
