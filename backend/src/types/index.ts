import { Request } from 'express';

// Mở rộng Request để chứa thông tin user sau khi xác thực JWT
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'host' | 'admin';
  };
}

// Thông tin người chơi trong phòng chờ và trong game
export interface Player {
  socketId: string;
  nickname: string;
  score: number;
  streak: number;
  joinedAt: Date;
}

// Trạng thái phiên chơi lưu trong bộ nhớ (in-memory)
export interface SessionState {
  sessionId: string;
  pin: string;
  quizId: string;
  hostSocketId: string;
  currentQuestionIndex: number;
  status:
    | 'waiting'
    | 'active'
    | 'question'
    | 'answer_reveal'
    | 'leaderboard'
    | 'ended';
  // key = socketId
  players: Map<string, Player>;
  // Số người đã trả lời câu hỏi hiện tại
  answeredCount: number;
  questionStartTime: number;
  currentTimeLimit: number;
  timer?: ReturnType<typeof setInterval>;
}

// Payload từ socket client
export interface HostJoinPayload {
  sessionId: string;
  token: string;
}

export interface PlayerJoinPayload {
  pin: string;
  nickname: string;
}

export interface SubmitAnswerPayload {
  sessionId: string;
  questionId: string;
  selectedOptions: string[];
  responseTime: number;
}

export interface HostActionPayload {
  sessionId: string;
}

export interface KickPlayerPayload {
  sessionId: string;
  socketId: string;
}

// Payload JWT
export interface JWTPayload {
  id: string;
  email: string;
  role: 'host' | 'admin';
}

// Thông tin thống kê đáp án
export interface OptionStat {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
  color: string;
}

// Thứ hạng người chơi
export interface RankingEntry {
  rank: number;
  nickname: string;
  score: number;
  delta?: number;
}
