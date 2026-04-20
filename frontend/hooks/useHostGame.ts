"use client";

import { useEffect } from "react";

import { useGameStore } from "@/stores/gameStore";
import { useSocket } from "@/hooks/useSocket";
import { GameStatus, OptionStat, Player, Question, Ranking } from "@/types";

interface UseHostGameResult {
  players: Player[];
  gameStatus: GameStatus;
  currentQuestion: Question | null;
  timeLeft: number;
  answerStats: OptionStat[];
  leaderboard: Ranking[];
  totalAnswered: number;
  startGame: () => void;
  nextQuestion: () => void;
  revealAnswer: () => void;
  showLeaderboard: () => void;
  endGame: () => void;
}

export function useHostGame(sessionId: string): UseHostGameResult {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
  const { socket } = useSocket(token || undefined);
  const {
    players,
    gameStatus,
    currentQuestion,
    answerStats,
    leaderboard,
    totalAnswered,
    setPlayers,
    setCurrentQuestion,
    setGameStatus,
    updateAnswerStats,
    setLeaderboard,
  } = useGameStore();

  useEffect(() => {
    if (!socket || !sessionId) {
      return;
    }

    socket.emit("host:join_room", { sessionId });

    socket.on("room:player_joined", (nextPlayers: Player[]) => setPlayers(nextPlayers));
    socket.on("room:player_left", (nextPlayers: Player[]) => setPlayers(nextPlayers));
    socket.on("question:show", (question: Question) => {
      setCurrentQuestion(question);
      setGameStatus("question");
    });
    socket.on("dashboard:update", (payload: { stats: OptionStat[]; totalAnswered: number }) => {
      updateAnswerStats(payload.stats, payload.totalAnswered);
    });
    socket.on("answer:reveal", (payload: { stats: OptionStat[] }) => {
      updateAnswerStats(payload.stats, totalAnswered);
      setGameStatus("answer_reveal");
    });
    socket.on("leaderboard:show", (ranking: Ranking[]) => {
      setLeaderboard(ranking);
      setGameStatus("leaderboard");
    });
    socket.on("game:ended", () => setGameStatus("ended"));

    return () => {
      socket.off("room:player_joined");
      socket.off("room:player_left");
      socket.off("question:show");
      socket.off("dashboard:update");
      socket.off("answer:reveal");
      socket.off("leaderboard:show");
      socket.off("game:ended");
    };
  }, [
    socket,
    sessionId,
    setPlayers,
    setCurrentQuestion,
    setGameStatus,
    updateAnswerStats,
    setLeaderboard,
    totalAnswered,
  ]);

  return {
    players,
    gameStatus,
    currentQuestion,
    timeLeft: currentQuestion?.timeLimit ?? 0,
    answerStats,
    leaderboard,
    totalAnswered,
    startGame: () => socket?.emit("host:start_game", { sessionId }),
    nextQuestion: () => socket?.emit("host:next_question", { sessionId }),
    revealAnswer: () => socket?.emit("host:reveal_answer", { sessionId }),
    showLeaderboard: () => socket?.emit("host:show_leaderboard", { sessionId }),
    endGame: () => socket?.emit("host:end_game", { sessionId }),
  };
}

