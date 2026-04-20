import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IQuiz extends Document {
  hostId: Types.ObjectId;
  title: string;
  description: string;
  thumbnail?: string;
  questions: Types.ObjectId[];
  isPublic: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>(
  {
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    thumbnail: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    isPublic: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
