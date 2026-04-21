import Link from "next/link";
import { CalendarDays, FileQuestion } from "lucide-react";

import { Quiz } from "@/types";

interface QuizCardProps {
  quiz: Quiz;
  onDelete: (id: string) => void;
}

export function QuizCard({ quiz, onDelete }: QuizCardProps) {
  return (
    <article className="glass-card flex h-full flex-col p-4">
      <div className="mb-3 h-28 rounded-lg bg-gradient-to-br from-white/20 via-white/10 to-transparent" />
      <h3 className="line-clamp-2 text-lg font-bold">{quiz.title}</h3>
      <div className="mt-2 space-y-1 text-sm text-white/80">
        <p className="inline-flex items-center gap-2">
          <FileQuestion className="size-4" />
          {quiz.questions.length} câu hỏi
        </p>
        <p className="inline-flex items-center gap-2">
          <CalendarDays className="size-4" />
          Cập nhật: {new Date(quiz.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Link href={`/quiz/${quiz._id}/chinh-sua`} className="rounded-lg bg-white/15 px-3 py-2 text-center text-sm font-semibold hover:bg-white/25">
          Chỉnh sửa
        </Link>
        <Link href={`/phong/${quiz._id}/cho?mode=host`} className="rounded-lg bg-[var(--accent)] px-3 py-2 text-center text-sm font-semibold hover:brightness-110">
          Tạo phòng
        </Link>
        <button
          type="button"
          onClick={() => onDelete(quiz._id)}
          className="rounded-lg bg-red-500/80 px-3 py-2 text-sm font-semibold hover:bg-red-500"
        >
          Xóa
        </button>
      </div>
    </article>
  );
}
