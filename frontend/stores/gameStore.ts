"use client";

import { create } from "zustand";

import { GameStatus, OptionStat, Player, Question, Ranking, Session } from "@/types";

interface GameStore {
  session: Session | null;
  players: Player[];
  currentQuestion: Question | null;
  answerStats: OptionStat[];
  totalAnswered: number;
  leaderboard: Ranking[];
  gameStatus: GameStatus;
  setSession: (session: Session) => void;
  setPlayers: (players: Player[]) => void;
  updateAnswerStats: (stats: OptionStat[], total: number) => void;
  setCurrentQuestion: (question: Question) => void;
  setLeaderboard: (ranking: Ranking[]) => void;
  setGameStatus: (status: GameStatus) => void;
  reset: () => void;
}

const initialState = {
  session: null,
  players: [],
  currentQuestion: null,
  answerStats: [],
  totalAnswered: 0,
  leaderboard: [],
  gameStatus: "idle" as GameStatus,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  setSession: (session) => set({ session }),
  setPlayers: (players) => set({ players }),
  updateAnswerStats: (answerStats, totalAnswered) => set({ answerStats, totalAnswered }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setGameStatus: (gameStatus) => set({ gameStatus }),
  reset: () => set(initialState),
}));
