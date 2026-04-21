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
  DashboardEvent,
} from '../events';

// Bộ nhớ đệm trạng thái phiên chơi
const sessionStore: Map<string, SessionState> = new Map();

/**
 * Tính điểm theo thuật toán Kahoot:
 * điểm = basePoints × timeFactor × streakBonus
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
 * Bắt đầu đếm ngược phía server và phát sự kiện time_tick mỗi giây.
 * Tự động phát time_up khi hết giờ.
 */
const startTimer = (io: Server, state: SessionState): void => {
  // Dọn timer cũ nếu có
  if (state.timer) clearInterval(state.timer);

  let timeLeft = state.currentTimeLimit;
  state.timer = setInterval(async () => {
    timeLeft--;
    io.to(`game:${state.pin}`).emit(QuestionEvent.TIME_TICK, { timeLeft });

    if (timeLeft <= 0) {
      clearInterval(state.timer as ReturnType<typeof setInterval>);
      state.timer = undefined;
      io.to(`game:${state.pin}`).emit(QuestionEvent.TIME_UP, {});
    }
  }, 1000);
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

        // Khởi tạo trạng thái phiên nếu chưa có
        if (!sessionStore.has(data.sessionId)) {
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
          });
        } else {
          const state = sessionStore.get(data.sessionId)!;
          state.hostSocketId = socket.id;
        }
      } catch {
        socket.emit(RoomEvent.ERROR, {
          message: 'Xác thực thất bại. Vui lòng đăng nhập lại.',
        });
      }
    },
  );

  // Host kick người chơi ra khỏi phòng
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

  // Host bắt đầu game
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
    },
  );

  // Host chuyển sang câu hỏi tiếp theo
  socket.on(
    HostEvent.NEXT_QUESTION,
    async (data: { sessionId: string }): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state || state.hostSocketId !== socket.id) return;

      state.currentQuestionIndex++;
      state.answeredCount = 0;
      state.status = 'question';

      await Session.findByIdAndUpdate(data.sessionId, {
        status: 'question',
        currentQuestionIndex: state.currentQuestionIndex,
      });

      // Lấy danh sách câu hỏi của quiz
      const session = await Session.findById(data.sessionId);
      if (!session) return;

      const questions = await Question.find({ quizId: session.quizId }).sort(
        'order',
      );
      const question = questions[state.currentQuestionIndex];

      if (!question) {
        socket.emit(RoomEvent.ERROR, { message: 'Không còn câu hỏi nào.' });
        return;
      }

      state.currentTimeLimit = question.timeLimit;
      state.questionStartTime = Date.now();

      // Gửi câu hỏi tới người chơi — KHÔNG bao gồm isCorrect
      io.to(`game:${state.pin}`).emit(QuestionEvent.SHOW, {
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

      startTimer(io, state);
    },
  );

  // Host hiển thị đáp án
  socket.on(
    HostEvent.REVEAL_ANSWER,
    async (data: { sessionId: string }): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state || state.hostSocketId !== socket.id) return;

      // Dừng timer
      if (state.timer) {
        clearInterval(state.timer);
        state.timer = undefined;
      }

      state.status = 'answer_reveal';
      await Session.findByIdAndUpdate(data.sessionId, {
        status: 'answer_reveal',
      });

      const session = await Session.findById(data.sessionId);
      if (!session) return;

      const questions = await Question.find({ quizId: session.quizId }).sort(
        'order',
      );
      const question = questions[state.currentQuestionIndex];
      if (!question) return;

      const correctOptions = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      // Thống kê số người chọn từng đáp án
      const answers = await PlayerAnswer.find({
        sessionId: data.sessionId,
        questionId: question._id,
      });

      const totalAnswered = answers.length;
      const optionCounts: Record<string, number> = {};
      question.options.forEach((o) => (optionCounts[o.id] = 0));
      answers.forEach((a) =>
        a.selectedOptions.forEach((id) => optionCounts[id]++),
      );

      const stats: OptionStat[] = question.options.map((o) => ({
        optionId: o.id,
        text: o.text,
        count: optionCounts[o.id] || 0,
        percentage:
          totalAnswered > 0
            ? Math.round(((optionCounts[o.id] || 0) / totalAnswered) * 100)
            : 0,
        color: o.color,
      }));

      io.to(`game:${state.pin}`).emit(AnswerEvent.REVEAL, {
        correctOptions,
        stats,
      });
    },
  );

  // Host hiển thị bảng xếp hạng
  socket.on(
    HostEvent.SHOW_LEADERBOARD,
    async (data: { sessionId: string }): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state || state.hostSocketId !== socket.id) return;

      state.status = 'leaderboard';
      await Session.findByIdAndUpdate(data.sessionId, {
        status: 'leaderboard',
      });

      // Lấy điểm trước để tính delta
      const prevScores: Record<string, number> = {};
      const dbSession = await Session.findById(data.sessionId);
      if (dbSession) {
        dbSession.players.forEach((p) => {
          prevScores[p.socketId] = p.score;
        });
      }

      const rankings: RankingEntry[] = buildRankings(state.players).map(
        (r) => ({
          ...r,
          delta: 0, // delta sẽ được tính từ câu hỏi hiện tại
        }),
      );

      io.to(`game:${state.pin}`).emit(LeaderboardEvent.SHOW, { rankings });
    },
  );

  // Host kết thúc game
  socket.on(
    HostEvent.END_GAME,
    async (data: { sessionId: string }): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state || state.hostSocketId !== socket.id) return;

      if (state.timer) {
        clearInterval(state.timer);
        state.timer = undefined;
      }

      state.status = 'ended';

      // Lưu trạng thái cuối cùng vào MongoDB
      const finalPlayers = [...state.players.values()].map((p) => ({
        socketId: p.socketId,
        nickname: p.nickname,
        score: p.score,
        streak: p.streak,
        joinedAt: p.joinedAt,
      }));

      await Session.findByIdAndUpdate(data.sessionId, {
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

      // Dọn dẹp bộ nhớ đệm
      sessionStore.delete(data.sessionId);
    },
  );
};

export { sessionStore };
