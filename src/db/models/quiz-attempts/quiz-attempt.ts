import mongoose from "mongoose";

export interface QuizAttempt {
    quizId: string;
    attemptedAt: Date;
    decimalScore: number;
    incorrectTermTupleIds: string[]
}

export interface MongoQuizAttempt extends QuizAttempt, mongoose.Document { }
export const QuizAttemptSchema = new mongoose.Schema<MongoQuizAttempt>({
    quizId: { type: String, required: true },
    incorrectTermTupleIds: { type: [String], required: true, default: [] },
    decimalScore: { type: Number, required: true },
    attemptedAt: { type: Date, required: true }
});

export default mongoose.models?.QuizAttempt || mongoose.model<MongoQuizAttempt>("QuizAttempt", QuizAttemptSchema);