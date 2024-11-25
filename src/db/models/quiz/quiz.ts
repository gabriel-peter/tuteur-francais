import mongoose from "mongoose";
import { Quiz } from "../../types";
import { TermTupleSchema } from "../TermTupleSchema";

export interface MongoQuiz extends Quiz, mongoose.Document {
    _id: string
 }
export const QuizSchema = new mongoose.Schema<MongoQuiz>({
    title: { type: String, required: true },
    items: { type: [TermTupleSchema], required: true },
    state: {
        type: String,
        enum: ["COMPLETED", "FAILED", "NEW"], // TODO make this more type-safe
        default: "NEW"
    },
});

// Middleware to handle cascading delete
QuizSchema.pre('findOneAndDelete', async function (next) {
    const quizId = this.getQuery()._id;

    // Remove all QuizAttempts associated with this quiz
    await mongoose.model('QuizAttempt').deleteMany({ quizId });
    
    next();
});

export default mongoose.models.Quiz || mongoose.model<MongoQuiz>("Quiz", QuizSchema);