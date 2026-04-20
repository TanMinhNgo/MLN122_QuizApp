import { Types } from 'mongoose';
import { Quiz } from '../models/Quiz.model';
import { Question } from '../models/Question.model';
import { AppError } from '../middlewares/error.middleware';

interface QuizInput {
  title: string;
  description?: string;
  thumbnail?: string;
  isPublic?: boolean;
}

interface QuestionInput {
  content: string;
  type: 'single' | 'multiple' | 'true_false';
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    color: string;
  }>;
  timeLimit?: number;
  points?: number;
  imageUrl?: string;
  order?: number;
}

export const quizService = {
  async getQuizzes(hostId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const query = { hostId: new Types.ObjectId(hostId), isDeleted: false };

    const [quizzes, total] = await Promise.all([
      Quiz.find(query)
        .select('-questions')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Quiz.countDocuments(query),
    ]);

    return {
      quizzes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async createQuiz(hostId: string, data: QuizInput) {
    const quiz = await Quiz.create({
      hostId: new Types.ObjectId(hostId),
      ...data,
    });
    return quiz;
  },

  async getQuiz(id: string, hostId: string) {
    const quiz = await Quiz.findOne({
      _id: new Types.ObjectId(id),
      hostId: new Types.ObjectId(hostId),
      isDeleted: false,
    }).populate('questions');

    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }
    return quiz;
  },

  async updateQuiz(id: string, hostId: string, data: Partial<QuizInput>) {
    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        hostId: new Types.ObjectId(hostId),
        isDeleted: false,
      },
      data,
      { new: true },
    );
    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }
    return quiz;
  },

  async deleteQuiz(id: string, hostId: string) {
    // Xóa mềm (soft delete)
    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        hostId: new Types.ObjectId(hostId),
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true },
    );
    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }
  },

  async addQuestion(quizId: string, hostId: string, data: QuestionInput) {
    // Xác minh quiz thuộc về host
    const quiz = await Quiz.findOne({
      _id: new Types.ObjectId(quizId),
      hostId: new Types.ObjectId(hostId),
      isDeleted: false,
    });
    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }

    // Xác định thứ tự tiếp theo
    const maxOrder = quiz.questions.length;
    const question = await Question.create({
      quizId: quiz._id,
      ...data,
      order: data.order ?? maxOrder,
    });

    quiz.questions.push(question._id as Types.ObjectId);
    await quiz.save();

    return question;
  },

  async updateQuestion(
    quizId: string,
    hostId: string,
    qId: string,
    data: Partial<QuestionInput>,
  ) {
    // Xác minh quiz thuộc về host
    const quiz = await Quiz.findOne({
      _id: new Types.ObjectId(quizId),
      hostId: new Types.ObjectId(hostId),
      isDeleted: false,
    });
    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }

    const question = await Question.findOneAndUpdate(
      { _id: new Types.ObjectId(qId), quizId: quiz._id },
      data,
      { new: true },
    );
    if (!question) {
      throw new AppError('Câu hỏi không tồn tại.', 404);
    }
    return question;
  },

  async deleteQuestion(quizId: string, hostId: string, qId: string) {
    const quiz = await Quiz.findOne({
      _id: new Types.ObjectId(quizId),
      hostId: new Types.ObjectId(hostId),
      isDeleted: false,
    });
    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }

    await Question.findOneAndDelete({
      _id: new Types.ObjectId(qId),
      quizId: quiz._id,
    });

    // Xóa câu hỏi khỏi danh sách của quiz
    quiz.questions = quiz.questions.filter((q) => q.toString() !== qId);
    await quiz.save();
  },

  async reorderQuestions(quizId: string, hostId: string, orderedIds: string[]) {
    const quiz = await Quiz.findOne({
      _id: new Types.ObjectId(quizId),
      hostId: new Types.ObjectId(hostId),
      isDeleted: false,
    });
    if (!quiz) {
      throw new AppError('Bộ câu hỏi không tồn tại.', 404);
    }

    // Cập nhật thứ tự từng câu hỏi
    const updates = orderedIds.map((id, index) =>
      Question.updateOne(
        { _id: new Types.ObjectId(id), quizId: quiz._id },
        { order: index },
      ),
    );
    await Promise.all(updates);

    // Sắp xếp lại mảng câu hỏi trong quiz
    quiz.questions = orderedIds.map((id) => new Types.ObjectId(id));
    await quiz.save();
  },
};
