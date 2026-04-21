"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownColor = "text-green-400" | "text-yellow-400" | "text-red-400";

interface UseCountdownResult {
  timeLeft: number;
  percentLeft: number;
  colorClass: CountdownColor;
}

export function useCountdown(initialTime: number, isRunning: boolean): UseCountdownResult {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, timeLeft]);

  const percentLeft = useMemo(() => {
    if (initialTime <= 0) {
      return 0;
    }
    return Math.round((timeLeft / initialTime) * 100);
  }, [initialTime, timeLeft]);

  const colorClass: CountdownColor = useMemo(() => {
    if (percentLeft > 50) {
      return "text-green-400";
    }

    if (percentLeft > 20) {
      return "text-yellow-400";
    }

    return "text-red-400";
  }, [percentLeft]);

  return { timeLeft, percentLeft, colorClass };
}
