import mongoose from "mongoose";
import { Quiz } from "../types";
import { TermTupleSchema } from "./TermTupleSchema";

export interface MongoQuiz extends Quiz, mongoose.Document { }
export const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    items: { type: [TermTupleSchema], required: true },
    state: {
        type: String,
        enum: ["COMPLETED", "FAILED", "NEW"], // TODO make this more type-safe
        default: "NEW"
    },
});

export default mongoose.models.Quiz || mongoose.model<MongoQuiz>("Quiz", QuizSchema);