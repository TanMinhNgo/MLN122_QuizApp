"use client";

import { create } from "zustand";

import { AnswerResult } from "@/types";

interface PlayerStore {
  pin: string;
  nickname: string;
  score: number;
  rank: number;
  streak: number;
  hasAnswered: boolean;
  lastAnswerResult: AnswerResult | null;
  setPin: (pin: string) => void;
  setNickname: (nickname: string) => void;
  updateScore: (score: number, rank: number) => void;
  setLastResult: (result: AnswerResult) => void;
  setHasAnswered: (hasAnswered: boolean) => void;
  reset: () => void;
}

const initialState = {
  pin: "",
  nickname: "",
  score: 0,
  rank: 0,
  streak: 0,
  hasAnswered: false,
  lastAnswerResult: null,
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  ...initialState,
  setPin: (pin) => set({ pin }),
  setNickname: (nickname) => set({ nickname }),
  updateScore: (score, rank) => set({ score, rank }),
  setLastResult: (lastAnswerResult) =>
    set({
      lastAnswerResult,
      streak: lastAnswerResult.streak,
    }),
  setHasAnswered: (hasAnswered) => set({ hasAnswered }),
  reset: () => set(initialState),
}));
