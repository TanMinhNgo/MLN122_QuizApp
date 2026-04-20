import { Types } from 'mongoose';
import { Session } from '../models/Session.model';
import { Quiz } from '../models/Quiz.model';
import { PlayerAnswer } from '../models/PlayerAnswer.model';
import { AppError } from '../middlewares/error.middleware';
import { generateUniquePin } from '../utils/pinGenerator';
import { generateQRCode } from '../utils/qrGenerator';

export const sessionService = {
  async createSession(hostId: string, quizId: string) {
    // Xác minh quiz tồn tại và thuộc về host
    const quiz = await Quiz.findOne({
      _id: new Types.ObjectId(quizId),
      hostId: new Types.ObjectId(hostId),
      isDeleted: false,
    }).populate('questions');

    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }

    if (quiz.questions.length === 0) {
      throw new AppError('Bộ câu hỏi phải có ít nhất 1 câu hỏi.', 400);
    }

    // Tạo PIN duy nhất và QR code
    const pin = await generateUniquePin();
    const qrCode = await generateQRCode(pin);

    const session = await Session.create({
      quizId: quiz._id,
      hostId: new Types.ObjectId(hostId),
      pin,
      qrCode,
      status: 'waiting',
    });

    return {
      sessionId: String(session._id),
      pin: session.pin,
      qrCode: session.qrCode,
    };
  },

  async getSessionByPin(pin: string) {
    const session = await Session.findOne({ pin }).select('-qrCode').lean();
    if (!session) {
      throw new AppError('Phòng chơi không tồn tại.', 404);
    }
    return session;
  },

  async getSessionResults(sessionId: string, hostId: string) {
    const session = await Session.findOne({
      _id: new Types.ObjectId(sessionId),
      hostId: new Types.ObjectId(hostId),
    }).lean();

    if (!session) {
      throw new AppError('Phiên chơi không tồn tại.', 404);
    }

    // Lấy tất cả câu trả lời của phiên
    const answers = await PlayerAnswer.find({
      sessionId: new Types.ObjectId(sessionId),
    })
      .populate('questionId', 'content options timeLimit points')
      .lean();

    // Xếp hạng người chơi
    const rankings = [...session.players]
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        rank: index + 1,
        nickname: player.nickname,
        score: player.score,
      }));

    return {
      session,
      rankings,
      answers,
    };
  },
};
