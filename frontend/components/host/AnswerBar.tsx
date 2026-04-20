interface AnswerBarProps {
  color: string;
  label: string;
  text: string;
  count: number;
  percentage: number;
}

export function AnswerBar({ color, label, text, count, percentage }: AnswerBarProps) {
  return (
    <article className="glass-card flex h-56 flex-col justify-end overflow-hidden border-t-8 p-3" style={{ borderTopColor: color }}>
      <div className="mb-3 text-sm font-semibold text-white/80">
        {label} {text}
      </div>
      <div className="relative h-28 rounded-md bg-white/10">
        <div
          className="absolute bottom-0 left-0 right-0 rounded-md transition-all"
          style={{ height: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="mt-2 text-xs text-white/80">
        {count} lượt ({percentage}%)
      </div>
    </article>
  );
}
