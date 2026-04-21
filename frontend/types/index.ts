export type GameStatus =
  | "idle"
  | "waiting"
  | "starting"
  | "question"
  | "answer_reveal"
  | "leaderboard"
  | "ended";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  color: string;
}

export interface Question {
  _id: string;
  content: string;
  type: "single" | "multiple" | "true_false";
  options: Option[];
  timeLimit: number;
  points: number;
  imageUrl?: string;
  order: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  questions: Question[];
  createdAt: string;
}

export interface Player {
  socketId: string;
  nickname: string;
  score: number;
  streak: number;
}

export interface OptionStat {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
  color: string;
}

export interface Ranking {
  rank: number;
  nickname: string;
  score: number;
  delta?: number;
}

export interface Session {
  _id: string;
  pin: string;
  qrCode: string;
  status: GameStatus;
  quizId: string;
}

export interface AnswerResult {
  isCorrect: boolean;
  pointsEarned: number;
  streak: number;
}
