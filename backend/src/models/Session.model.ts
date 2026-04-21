import mongoose, { Document, Schema, Types } from 'mongoose';

export type SessionStatus =
  | 'waiting'
  | 'active'
  | 'question'
  | 'answer_reveal'
  | 'leaderboard'
  | 'ended';

export interface ISessionPlayer {
  socketId: string;
  nickname: string;
  score: number;
  streak: number;
  joinedAt: Date;
}

export interface ISession extends Document {
  quizId: Types.ObjectId;
  hostId: Types.ObjectId;
  pin: string;
  qrCode: string;
  status: SessionStatus;
  currentQuestionIndex: number;
  players: ISessionPlayer[];
  startedAt?: Date;
  endedAt?: Date;
}

const sessionPlayerSchema = new Schema<ISessionPlayer>(
  {
    socketId: { type: String, required: true },
    nickname: { type: String, required: true },
    score: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const sessionSchema = new Schema<ISession>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pin: { type: String, required: true, unique: true },
  qrCode: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'waiting',
      'active',
      'question',
      'answer_reveal',
      'leaderboard',
      'ended',
    ],
    default: 'waiting',
  },
  currentQuestionIndex: { type: Number, default: -1 },
  players: [sessionPlayerSchema],
  startedAt: { type: Date },
  endedAt: { type: Date },
});

export const Session = mongoose.model<ISession>('Session', sessionSchema);
