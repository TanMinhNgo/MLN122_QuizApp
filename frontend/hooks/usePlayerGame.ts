"use client";

import { useEffect, useState } from "react";

import { useSocket } from "@/hooks/useSocket";
import { usePlayerStore } from "@/stores/playerStore";
import { GameStatus, Question, Ranking } from "@/types";

interface UsePlayerGameResult {
  gameStatus: GameStatus;
  currentQuestion: Question | null;
  timeLeft: number;
  hasAnswered: boolean;
  myScore: number;
  myRank: number;
  leaderboard: Ranking[];
  joinRoom: (pin: string, nickname: string) => void;
  submitAnswer: (questionId: string, optionId: string) => void;
}

export function usePlayerGame(): UsePlayerGameResult {
  const { socket } = useSocket();
  const {
    score,
    rank,
    hasAnswered,
    setHasAnswered,
    setLastResult,
    updateScore,
  } = usePlayerStore();

  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Ranking[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("game:started", () => setGameStatus("question"));
    socket.on("question:show", (question: Question) => {
      setCurrentQuestion(question);
      setHasAnswered(false);
      setGameStatus("question");
      setTimeLeft(question.timeLimit);
    });
    socket.on("question:time_tick", (payload: { timeLeft: number }) => {
      setTimeLeft(payload.timeLeft);
    });
    socket.on("question:time_up", () => setGameStatus("answer_reveal"));
    socket.on(
      "answer:reveal",
      (payload: {
        isCorrect: boolean;
        pointsEarned: number;
        streak: number;
        score: number;
        rank: number;
      }) => {
        setLastResult(payload);
        updateScore(payload.score, payload.rank);
        setGameStatus("answer_reveal");
      },
    );
    socket.on("leaderboard:show", (nextRanking: Ranking[]) => {
      setLeaderboard(nextRanking);
      setGameStatus("leaderboard");
    });
    socket.on("game:ended", () => setGameStatus("ended"));

    return () => {
      socket.off("game:started");
      socket.off("question:show");
      socket.off("question:time_tick");
      socket.off("question:time_up");
      socket.off("answer:reveal");
      socket.off("leaderboard:show");
      socket.off("game:ended");
    };
  }, [socket, setHasAnswered, setLastResult, updateScore]);

  return {
    gameStatus,
    currentQuestion,
    timeLeft,
    hasAnswered,
    myScore: score,
    myRank: rank,
    leaderboard,
    joinRoom: (pin, nickname) => socket?.emit("player:join_room", { pin, nickname }),
    submitAnswer: (questionId, optionId) => {
      setHasAnswered(true);
      socket?.emit("player:submit_answer", { questionId, optionId });
    },
  };
}
