"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { QuizCard } from "@/components/host/QuizCard";
import { api } from "@/lib/api";
import { Quiz } from "@/types";

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get<Quiz[]>("/quizzes");
        setQuizzes(response.data);
      } catch {
        setError("Không thể tải danh sách quiz.");
      } finally {
        setLoading(false);
      }
    };

    void fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (id: string) => {
    const accepted = window.confirm("Bạn có chắc muốn xóa quiz này không?");
    if (!accepted) {
      return;
    }

    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes((current) => current.filter((quiz) => quiz._id !== id));
      toast.success("Đã xóa quiz thành công");
    } catch {
      toast.error("Xóa quiz thất bại, vui lòng thử lại.");
    }
  };

  return (
    <main className="mx-auto mt-6 w-[min(1100px,calc(100%-2rem))]">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard Quiz</h1>
          <p className="text-white/80">Quản lý bộ câu hỏi và tạo phòng chơi realtime.</p>
        </div>
        <Link
          href="/quiz/create"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold hover:brightness-110"
        >
          Tạo Quiz Mới
        </Link>
      </header>

      {loading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="glass-card h-56 animate-pulse" />
          ))}
        </section>
      ) : null}

      {error ? <p className="glass-card p-4 text-red-200">{error}</p> : null}

      {!loading && !error && quizzes.length === 0 ? (
        <section className="glass-card p-8 text-center">
          <p className="text-xl font-bold">Bạn chưa có quiz nào</p>
          <p className="mt-1 text-white/80">Hãy tạo quiz đầu tiên để bắt đầu buổi học tương tác.</p>
        </section>
      ) : null}

      {!loading && !error && quizzes.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteQuiz} />
          ))}
        </section>
      ) : null}
    </main>
  );
}
