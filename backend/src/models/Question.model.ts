import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
  color: string;
}

export interface IQuestion extends Document {
  quizId: Types.ObjectId;
  content: string;
  type: 'single' | 'multiple' | 'true_false';
  options: IOption[];
  timeLimit: number;
  points: number;
  imageUrl?: string;
  order: number;
}

const optionSchema = new Schema<IOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    color: { type: String, required: true },
  },
  { _id: false },
);

const questionSchema = new Schema<IQuestion>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  content: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['single', 'multiple', 'true_false'],
    required: true,
  },
  options: { type: [optionSchema], required: true },
  timeLimit: {
    type: Number,
    enum: [5, 10, 20, 30, 60, 90, 120],
    default: 20,
  },
  points: { type: Number, enum: [1000, 2000], default: 1000 },
  imageUrl: { type: String },
  order: { type: Number, required: true, default: 0 },
});

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
