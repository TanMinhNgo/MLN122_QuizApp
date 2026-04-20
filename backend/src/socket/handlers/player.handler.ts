import { Server, Socket } from 'socket.io';
import { Session } from '../../models/Session.model';
import { Question } from '../../models/Question.model';
import { PlayerAnswer } from '../../models/PlayerAnswer.model';
import { Player, SubmitAnswerPayload, OptionStat } from '../../types';
import { PlayerEvent, RoomEvent, AnswerEvent, DashboardEvent } from '../events';
import { sessionStore } from './host.handler';

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

export const registerPlayerHandlers = (io: Server, socket: Socket): void => {
  // Người chơi tham gia phòng bằng PIN và nickname
  socket.on(
    PlayerEvent.JOIN_ROOM,
    async (data: { pin: string; nickname: string }): Promise<void> => {
      const session = await Session.findOne({ pin: data.pin });

      if (!session) {
        socket.emit(RoomEvent.ERROR, { message: 'Phòng chơi không tồn tại.' });
        return;
      }

      if (session.status !== 'waiting') {
        socket.emit(RoomEvent.ERROR, {
          message: 'Phòng chơi đã bắt đầu, không thể tham gia.',
        });
        return;
      }

      const sessionId = session._id.toString();
      let state = sessionStore.get(sessionId);

      if (!state) {
        socket.emit(RoomEvent.ERROR, {
          message: 'Phòng chơi chưa được host mở.',
        });
        return;
      }

      // Kiểm tra nickname trùng
      const nicknameExists = [...state.players.values()].some(
        (p) => p.nickname.toLowerCase() === data.nickname.toLowerCase(),
      );
      if (nicknameExists) {
        socket.emit(RoomEvent.ERROR, {
          message: 'Nickname đã được sử dụng, vui lòng chọn tên khác.',
        });
        return;
      }

      const player: Player = {
        socketId: socket.id,
        nickname: data.nickname.trim(),
        score: 0,
        streak: 0,
        joinedAt: new Date(),
      };

      state.players.set(socket.id, player);
      await socket.join(`game:${data.pin}`);

      // Thông báo cho toàn phòng
      const playerList = [...state.players.values()];
      io.to(`game:${data.pin}`).emit(RoomEvent.PLAYER_JOINED, {
        players: playerList,
      });
    },
  );

  // Người chơi nộp câu trả lời
  socket.on(
    PlayerEvent.SUBMIT_ANSWER,
    async (data: SubmitAnswerPayload): Promise<void> => {
      const state = sessionStore.get(data.sessionId);
      if (!state) return;

      const player = state.players.get(socket.id);
      if (!player) return;

      // Chỉ chấp nhận trả lời khi đang ở trạng thái question
      if (state.status !== 'question') return;

      const question = await Question.findById(data.questionId);
      if (!question) return;

      // Kiểm tra đáp án đúng
      const correctIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);
      const isCorrect =
        data.selectedOptions.length === correctIds.length &&
        data.selectedOptions.every((id) => correctIds.includes(id));

      let pointsEarned = 0;

      if (isCorrect) {
        player.streak++;
        pointsEarned = calculateScore(
          question.points,
          question.timeLimit,
          data.responseTime,
          player.streak,
        );
        player.score += pointsEarned;
      } else {
        player.streak = 0;
      }

      // Lưu câu trả lời vào DB
      await PlayerAnswer.create({
        sessionId: data.sessionId,
        questionId: data.questionId,
        playerSocketId: socket.id,
        nickname: player.nickname,
        selectedOptions: data.selectedOptions,
        isCorrect,
        responseTime: data.responseTime,
        pointsEarned,
      });

      state.answeredCount++;

      // Gửi kết quả về cho người chơi
      socket.emit(AnswerEvent.RECEIVED, {
        pointsEarned,
        isCorrect,
        streak: player.streak,
      });

      // Cập nhật dashboard cho host theo thời gian thực
      const totalPlayers = state.players.size;
      const answers = await PlayerAnswer.find({
        sessionId: data.sessionId,
        questionId: data.questionId,
      });

      const optionCounts: Record<string, number> = {};
      question.options.forEach((o) => (optionCounts[o.id] = 0));
      answers.forEach((a) =>
        a.selectedOptions.forEach((id) => optionCounts[id]++),
      );

      const optionStats: OptionStat[] = question.options.map((o) => ({
        optionId: o.id,
        text: o.text,
        count: optionCounts[o.id] || 0,
        percentage:
          answers.length > 0
            ? Math.round(((optionCounts[o.id] || 0) / answers.length) * 100)
            : 0,
        color: o.color,
      }));

      // Gửi update dashboard chỉ tới host socket
      io.to(state.hostSocketId).emit(DashboardEvent.UPDATE, {
        questionId: data.questionId,
        totalAnswered: state.answeredCount,
        totalPlayers,
        optionStats,
      });
    },
  );

  // Xử lý khi người chơi ngắt kết nối
  socket.on('disconnect', async (): Promise<void> => {
    // Tìm phiên chơi mà người chơi này đang tham gia
    for (const [sessionId, state] of sessionStore.entries()) {
      if (state.players.has(socket.id)) {
        state.players.delete(socket.id);

        const playerList = [...state.players.values()];
        io.to(`game:${state.pin}`).emit(RoomEvent.PLAYER_LEFT, {
          players: playerList,
        });
        break;
      }
    }
  });
};
