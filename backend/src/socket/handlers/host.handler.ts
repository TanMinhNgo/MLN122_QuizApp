import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { Session } from '../../models/Session.model';
import { Question } from '../../models/Question.model';
import { PlayerAnswer } from '../../models/PlayerAnswer.model';
import {
  SessionState,
  Player,
  JWTPayload,
  OptionStat,
  RankingEntry,
} from '../../types';
import {
  HostEvent,
  RoomEvent,
  GameEvent,
  QuestionEvent,
  AnswerEvent,
  LeaderboardEvent,
} from '../events';

// Bộ nhớ đệm trạng thái phiên chơi
const sessionStore: Map<string, SessionState> = new Map();

// Thời gian tự động chuyển trạng thái (ms)
const REVEAL_DELAY = 1000; // time_up → hiển thị đáp án sau 1s
const LEADERBOARD_DELAY = 4000; // đáp án → bảng xếp hạng sau 4s
const NEXT_QUESTION_DELAY = 4000; // bảng xếp hạng → câu tiếp sau 4s
const FIRST_QUESTION_DELAY = 3000; // game:started → câu đầu tiên sau 3s

/**
 * Tính điểm theo thuật toán Kahoot
 */
const calculateScore = (
  basePoints: number,
  timeLimit: number,
  responseTimeMs: number,
  streak: number,
): number => {
  const timeFactor = (timeLimit - responseTimeMs / 1000) / timeLimit;
  const streakBonus = streak >= 3 ? 1.2 : 1.0;
  return Math.round(basePoints * Math.max(0, timeFactor) * streakBonus);
};

/**
 * Tạo danh sách xếp hạng từ Map người chơi.
 */
const buildRankings = (players: Map<string, Player>): RankingEntry[] => {
  return [...players.values()]
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({
      rank: index + 1,
      nickname: p.nickname,
      score: p.score,
    }));
};

/**
 * Xoá auto timer nếu còn đang chạy
 */
const clearAutoTimer = (state: SessionState): void => {
  if (state.autoTimer) {
    clearTimeout(state.autoTimer);
    state.autoTimer = undefined;
  }
};

// ─── Standalone auto-advance functions ───────────────────────────────────────

/**
 * Hiển thị đáp án đúng + thống kê, rồi lên lịch show leaderboard.
 */
const doRevealAnswer = async (io: Server, sessionId: string): Promise<void> => {
  const state = sessionStore.get(sessionId);
  if (!state) return;

  if (state.timer) {
    clearInterval(state.timer);
    state.timer = undefined;
  }
  clearAutoTimer(state);

  state.status = 'answer_reveal';
  await Session.findByIdAndUpdate(sessionId, { status: 'answer_reveal' });

  const session = await Session.findById(sessionId);
  if (!session) return;

  const questions = await Question.find({ quizId: session.quizId }).sort(
    'order',
  );
  const question = questions[state.currentQuestionIndex];
  if (!question) return;

  const correctOptions = question.options
    .filter((o) => o.isCorrect)
    .map((o) => o.id);

  const answers = await PlayerAnswer.find({
    sessionId,
    questionId: question._id,
  });
  const totalAnswered = answers.length;
  const optionCounts: Record<string, number> = {};
  question.options.forEach((o) => (optionCounts[o.id] = 0));
  answers.forEach((a) => a.selectedOptions.forEach((id) => optionCounts[id]++));

  const stats: OptionStat[] = question.options.map((o) => ({
    optionId: o.id,
    text: o.text,
    count: optionCounts[o.id] || 0,
    percentage:
      totalAnswered > 0
        ? Math.round(((optionCounts[o.id] || 0) / totalAnswered) * 100)
        : 0,
    color: o.color,
    isCorrect: o.isCorrect,
  }));

  io.to(`game:${state.pin}`).emit(AnswerEvent.REVEAL, {
    correctOptions,
    stats,
  });

  state.autoTimer = setTimeout(() => {
    void doShowLeaderboard(io, sessionId);
  }, LEADERBOARD_DELAY);
};

/**
 * Hiển thị bảng xếp hạng, rồi lên lịch chuyển câu tiếp hoặc kết thúc.
 */
const doShowLeaderboard = async (
  io: Server,
  sessionId: string,
): Promise<void> => {
  const state = sessionStore.get(sessionId);
  if (!state) return;

  clearAutoTimer(state);

  state.status = 'leaderboard';
  await Session.findByIdAndUpdate(sessionId, { status: 'leaderboard' });

  const rankings: RankingEntry[] = buildRankings(state.players).map((r) => ({
    ...r,
    delta: 0,
  }));

  io.to(`game:${state.pin}`).emit(LeaderboardEvent.SHOW, { rankings });

  const session = await Session.findById(sessionId);
  if (!session) return;
  const questions = await Question.find({ quizId: session.quizId }).sort(
    'order',
  );
  const hasMore = state.currentQuestionIndex + 1 < questions.length;

  state.autoTimer = setTimeout(() => {
    if (hasMore) {
      void doNextQuestion(io, sessionId);
    } else {
      void doEndGame(io, sessionId);
    }
  }, NEXT_QUESTION_DELAY);
};

/**
 * Chuyển sang câu hỏi tiếp theo và bắt đầu timer mới.
 */
const doNextQuestion = async (io: Server, sessionId: string): Promise<void> => {
  const state = sessionStore.get(sessionId);
  if (!state) return;

  clearAutoTimer(state);

  state.currentQuestionIndex++;
  state.answeredCount = 0;
  state.status = 'question';

  await Session.findByIdAndUpdate(sessionId, {
    status: 'question',
    currentQuestionIndex: state.currentQuestionIndex,
  });

  const session = await Session.findById(sessionId);
  if (!session) return;

  const questions = await Question.find({ quizId: session.quizId }).sort(
    'order',
  );
  const question = questions[state.currentQuestionIndex];
  if (!question) return;

  state.currentTimeLimit = question.timeLimit;
  state.questionStartTime = Date.now();

  io.to(`game:${state.pin}`).emit(QuestionEvent.SHOW, {
    _id: question._id.toString(),
    index: state.currentQuestionIndex,
    total: questions.length,
    content: question.content,
    type: question.type,
    options: question.options.map((o) => ({
      id: o.id,
      text: o.text,
      color: o.color,
    })),
    timeLimit: question.timeLimit,
    points: question.points,
    imageUrl: question.imageUrl,
  });

  startTimer(io, state, sessionId);
};

/**
 * Kết thúc game, lưu DB, phát sự kiện kết thúc.
 */
const doEndGame = async (io: Server, sessionId: string): Promise<void> => {
  const state = sessionStore.get(sessionId);
  if (!state) return;

  if (state.timer) {
    clearInterval(state.timer);
    state.timer = undefined;
  }
  clearAutoTimer(state);

  state.status = 'ended';

  const finalPlayers = [...state.players.values()].map((p) => ({
    socketId: p.socketId,
    nickname: p.nickname,
    score: p.score,
    streak: p.streak,
    joinedAt: p.joinedAt,
  }));

  await Session.findByIdAndUpdate(sessionId, {
    status: 'ended',
    players: finalPlayers,
    endedAt: new Date(),
  });

  const finalRankings = buildRankings(state.players).map((r) => ({
    rank: r.rank,
    nickname: r.nickname,
    score: r.score,
  }));

  io.to(`game:${state.pin}`).emit(GameEvent.ENDED, { finalRankings });

  sessionStore.delete(sessionId);
};

/**
 * Bắt đầu đếm ngược phía server — tự động reveal khi hết giờ.
 */
const startTimer = (
  io: Server,
  state: SessionState,
  sessionId: string,
): void => {
  if (state.timer) clearInterval(state.timer);

  let timeLeft = state.currentTimeLimit;
  state.timer = setInterval(() => {
    timeLeft--;
    io.to(`game:${state.pin}`).emit(QuestionEvent.TIME_TICK, { timeLeft });

    if (timeLeft <= 0) {
      clearInterval(state.timer as ReturnType<typeof setInterval>);
      state.timer = undefined;
      io.to(`game:${state.pin}`).emit(QuestionEvent.TIME_UP, {});

      state.autoTimer = setTimeout(() => {
        void doRevealAnswer(io, sessionId);
      }, REVEAL_DELAY);
    }
  }, 1000);
};

// ─── Socket event handlers ────────────────────────────────────────────────────

export const registerHostHandlers = (io: Server, socket: Socket): void => {
  // Host xác thực và tham gia phòng
  socket.on(
    HostEvent.JOIN_ROOM,
    async (data: { sessionId: string; token: string }): Promise<void> => {
      try {
        const decoded = jwt.verify(
          data.token,
          ENV.JWT_ACCESS_SECRET,
        ) as JWTPayload;

        const session = await Session.findById(data.sessionId);
        if (!session || session.hostId.toString() !== decoded.id) {
          socket.emit(RoomEvent.ERROR, { message: 'Phiên chơi không hợp lệ.' });
          return;
        }

        await socket.join(`host:${data.sessionId}`);
        await socket.join(`game:${session.pin}`);

        if (!sessionStore.has(data.sessionId)) {
          const questions = await Question.find({
            quizId: session.quizId,
          }).sort('order');
          sessionStore.set(data.sessionId, {
            sessionId: data.sessionId,
            pin: session.pin,
            quizId: session.quizId.toString(),
            hostSocketId: socket.id,
            currentQuestionIndex: -1,
            status: 'waiting',
            players: new Map(),
            answeredCount: 0,
            questionStartTime: 0,
            currentTimeLimit: 0,
            totalQuestions: questions.length,
          });
        } else {
          const state = sessionStore.get(data.sessionId)!;
          state.hostSocketId = socket.id;
        }

        // Send current player list to host immediately (prevents stale UI)
        const nextState = sessionStore.get(data.sessionId);
        const playerList = nextState ? [...nextState.players.values()] : [];
        socket.emit(RoomEvent.PLAYER_JOINED, { players: playerList });
      } catch {
        socket.emit(RoomEvent.ERROR, {
          message: 'Xác thực thất bại. Vui lòng đăng nhập lại.',
        });
      }
    },
  );

  // Host kick người chơi
  socket.on(
    HostEvent.KICK_PLAYER,
    async (data: { sessionId: string; socketId: string }): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state || state.hostSocketId !== socket.id) return;

      state.players.delete(data.socketId);
      io.to(data.socketId).emit(RoomEvent.KICKED, {});
      const targetSocket = io.sockets.sockets.get(data.socketId);
      if (targetSocket) {
        await targetSocket.leave(`game:${state.pin}`);
      }

      const playerList = [...state.players.values()];
      io.to(`game:${state.pin}`).emit(RoomEvent.PLAYER_JOINED, {
        players: playerList,
      });
    },
  );

  // Host bắt đầu game → tự động chạy câu đầu tiên sau FIRST_QUESTION_DELAY
  socket.on(
    HostEvent.START_GAME,
    async (data: { sessionId: string }): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state || state.hostSocketId !== socket.id) return;

      state.status = 'active';
      await Session.findByIdAndUpdate(data.sessionId, {
        status: 'active',
        startedAt: new Date(),
      });

      io.to(`game:${state.pin}`).emit(GameEvent.STARTED, {});

      state.autoTimer = setTimeout(() => {
        void doNextQuestion(io, data.sessionId);
      }, FIRST_QUESTION_DELAY);
    },
  );

  // Host kết thúc game thủ công (nút khẩn cấp)
  socket.on(
    HostEvent.END_GAME,
    async (data: { sessionId: string }): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state || state.hostSocketId !== socket.id) return;
      await doEndGame(io, data.sessionId);
    },
  );
};

export { sessionStore };
