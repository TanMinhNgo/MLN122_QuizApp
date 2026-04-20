"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/lib/api";

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (title.trim().length < 3) {
      toast.error("Tiêu đề quiz cần ít nhất 3 ký tự.");
      return;
    }

    try {
      setSaving(true);
      const response = await api.post<{ _id: string }>("/quizzes", {
        title,
        description,
      });
      toast.success("Đã tạo quiz mới");
      router.push(`/quiz/${response.data._id}/chinh-sua`);
    } catch {
      toast.error("Không thể tạo quiz, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto mt-6 w-[min(900px,calc(100%-2rem))]">
      <section className="glass-card p-6">
        <h1 className="text-2xl font-extrabold">Tạo Quiz Mới</h1>
        <p className="mt-1 text-white/80">Bước đầu để tạo phòng chơi: nhập tiêu đề và mô tả quiz.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-semibold">
              Tiêu đề quiz
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Ví dụ: Ôn tập Sinh học lớp 12"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-semibold">
              Mô tả
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Mục tiêu bài kiểm tra..."
            />
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Tạo quiz"}
          </button>
        </div>
      </section>
    </main>
  );
}
