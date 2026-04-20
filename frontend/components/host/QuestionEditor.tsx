"use client";

import { useMemo, useState } from "react";

import { Option } from "@/types";
import { OptionEditor } from "@/components/host/OptionEditor";

interface QuestionEditorProps {
  title?: string;
  options: Option[];
}

export function QuestionEditor({ title = "Trình chỉnh sửa câu hỏi", options }: QuestionEditorProps) {
  const [correctOptionIds, setCorrectOptionIds] = useState<string[]>([options[0]?.id ?? ""]);

  const typeLabel = useMemo(() => "Một đáp án", []);

  return (
    <section className="glass-card p-5">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <p className="mt-1 text-white/80">Biên soạn câu hỏi, đáp án đúng và thời gian trả lời.</p>

      <div className="mt-5 grid gap-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-[var(--accent)] px-3 py-1 font-semibold">{typeLabel}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">20 giây</span>
          <span className="rounded-full bg-white/15 px-3 py-1">1000 điểm</span>
        </div>

        <textarea
          rows={4}
          className="w-full rounded-lg border border-white/25 bg-white/10 p-3 outline-none"
          placeholder="Nhập nội dung câu hỏi..."
          defaultValue="Ví dụ: Đâu là ngôn ngữ chạy trên trình duyệt?"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option, index) => {
            const labels = ["▲", "◆", "●", "■"];
            return (
              <OptionEditor
                key={option.id}
                option={option}
                label={labels[index] || "•"}
                checked={correctOptionIds.includes(option.id)}
                onToggle={() => setCorrectOptionIds([option.id])}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
