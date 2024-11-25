import mongoose, { ObjectId } from "mongoose";

export interface QuizAttempt {
    quizId: ObjectId;
    attemptedAt: Date;
    decimalScore: number;
    incorrectTermTupleIds: string[]
}

export interface MongoQuizAttempt extends QuizAttempt, mongoose.Document {
    _id: string
 }
export const QuizAttemptSchema = new mongoose.Schema<MongoQuizAttempt>({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    incorrectTermTupleIds: { type: [String], required: true, default: [] },
    decimalScore: { type: Number, required: true },
    attemptedAt: { type: Date, required: true }
});

export default mongoose.models?.QuizAttempt || mongoose.model<MongoQuizAttempt>("QuizAttempt", QuizAttemptSchema);