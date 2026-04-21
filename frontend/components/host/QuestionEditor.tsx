'use client';

import { useState } from 'react';

import { Option, Question } from '@/types';
import { OptionEditor } from '@/components/host/OptionEditor';

const OPTION_SYMBOLS = ['▲', '◆', '●', '■'];
const DEFAULT_OPTIONS: Option[] = [
  { id: 'a', text: '', isCorrect: false, color: '#ef4444' },
  { id: 'b', text: '', isCorrect: false, color: '#3b82f6' },
  { id: 'c', text: '', isCorrect: false, color: '#f59e0b' },
  { id: 'd', text: '', isCorrect: false, color: '#22c55e' },
];

function cloneDefaultOptions() {
  return DEFAULT_OPTIONS.map((option) => ({ ...option }));
}

function getInitialFormState(question: Question | null) {
  if (!question) {
    return {
      content: '',
      timeLimit: 20,
      points: 1000,
      options: cloneDefaultOptions(),
      correctIds: [] as string[],
    };
  }

  return {
    content: question.content,
    timeLimit: question.timeLimit,
    points: question.points,
    options: question.options.map((option) => ({ ...option })),
    correctIds: question.options.filter((option) => option.isCorrect).map((option) => option.id),
  };
}

interface QuestionEditorProps {
  question: Question | null;
  isNew?: boolean;
  saving: boolean;
  onSave: (data: Omit<Question, '_id' | 'order'>) => Promise<void>;
  onDelete: () => void;
}

export function QuestionEditor({
  question,
  isNew = false,
  saving,
  onSave,
  onDelete,
}: QuestionEditorProps) {
  if (!question && !isNew) {
    return (
      <section className="glass-card flex min-h-50 items-center justify-center p-10 text-center text-mln-dim">
        <p className="text-sm">Chọn hoặc thêm câu hỏi để bắt đầu biên soạn.</p>
      </section>
    );
  }

  const editorKey = question?._id ?? 'new-question';

  return (
    <QuestionEditorForm
      key={editorKey}
      question={question}
      saving={saving}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}

interface QuestionEditorFormProps {
  question: Question | null;
  saving: boolean;
  onSave: (data: Omit<Question, '_id' | 'order'>) => Promise<void>;
  onDelete: () => void;
}

function QuestionEditorForm({
  question,
  saving,
  onSave,
  onDelete,
}: QuestionEditorFormProps) {
  const initial = getInitialFormState(question);
  const [content, setContent] = useState(initial.content);
  const [timeLimit, setTimeLimit] = useState(initial.timeLimit);
  const [points, setPoints] = useState(initial.points);
  const [options, setOptions] = useState<Option[]>(initial.options);
  const [correctIds, setCorrectIds] = useState<string[]>(initial.correctIds);

  const handleToggleCorrect = (optionId: string) => {
    setCorrectIds([optionId]);
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === optionId ? { ...option, text } : option,
      ),
    );
  };

  const handleSave = async () => {
    await onSave({
      content,
      type: 'single',
      timeLimit,
      points,
      options: options.map((option) => ({
        ...option,
        isCorrect: correctIds.includes(option.id),
      })),
    });
  };

  return (
    <section className="glass-card p-6">
      <h2 className="font-semibold text-mln-cream">Biên soạn câu hỏi</h2>
      <p className="mt-0.5 text-sm text-mln-dim">
        Nhập nội dung, các phương án và xác định đáp án đúng.
      </p>

      <div className="mt-5 grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-mln-red/15 px-3 py-1 text-xs font-semibold text-mln-red">
            Một đáp án
          </span>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-mln-cream outline-none transition focus:border-mln-red/50"
          >
            {[5, 10, 20, 30, 60, 90, 120].map((t) => (
              <option key={t} value={t} className="bg-mln-mid">
                {t} giây
              </option>
            ))}
          </select>
          <select
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-mln-cream outline-none transition focus:border-mln-red/50"
          >
            <option value={1000} className="bg-mln-mid">
              1000 điểm
            </option>
            <option value={2000} className="bg-mln-mid">
              2000 điểm
            </option>
          </select>
        </div>

        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/6 p-4 text-mln-cream outline-none transition placeholder:text-mln-dim/50 focus:border-mln-red/50 focus:ring-2 focus:ring-mln-red/10"
          placeholder="Nhập nội dung câu hỏi..."
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option, index) => (
            <OptionEditor
              key={option.id}
              option={option}
              label={OPTION_SYMBOLS[index] || '•'}
              checked={correctIds.includes(option.id)}
              onToggle={() => handleToggleCorrect(option.id)}
              onTextChange={(text) => handleOptionTextChange(option.id, text)}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="rounded-xl bg-linear-to-br from-mln-red to-mln-red-dark px-5 py-2.5 font-semibold text-white shadow-md shadow-mln-red/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu câu hỏi'}
          </button>
          {question && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-mln-dim transition hover:border-mln-red/40 hover:text-mln-red-light"
            >
              Xóa câu hỏi
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
