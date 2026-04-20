"use client";

import { useState } from "react";

interface AnswerButtonProps {
  symbol: string;
  text: string;
  color: string;
}

export function AnswerButton({ symbol, text, color }: AnswerButtonProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <button
      type="button"
      disabled={submitted}
      onClick={() => setSubmitted(true)}
      className="min-h-20 rounded-xl px-4 py-5 text-left text-lg font-bold transition disabled:opacity-80"
      style={{ backgroundColor: color }}
    >
      {submitted ? "✓ Đã chọn" : `${symbol} ${text}`}
    </button>
  );
}
