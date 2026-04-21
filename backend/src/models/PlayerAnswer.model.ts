import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPlayerAnswer extends Document {
  sessionId: Types.ObjectId;
  questionId: Types.ObjectId;
  playerSocketId: string;
  nickname: string;
  selectedOptions: string[];
  isCorrect: boolean;
  responseTime: number;
  pointsEarned: number;
  answeredAt: Date;
}

const playerAnswerSchema = new Schema<IPlayerAnswer>({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  playerSocketId: { type: String, required: true },
  nickname: { type: String, required: true },
  selectedOptions: [{ type: String }],
  isCorrect: { type: Boolean, required: true },
  responseTime: { type: Number, required: true },
  pointsEarned: { type: Number, required: true },
  answeredAt: { type: Date, default: Date.now },
});

export const PlayerAnswer = mongoose.model<IPlayerAnswer>(
  'PlayerAnswer',
  playerAnswerSchema,
);
