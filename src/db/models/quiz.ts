import mongoose from "mongoose";
import { Quiz } from "../types";

const TermSchema = new mongoose.Schema({
    word: { type: String, required: true },
    language: {
        type: String,
        enum: ["English", "French"],
        required: true
    },
    examples: [String],
});

const TermTupleSchema = new mongoose.Schema({
    firstTerm: { type: TermSchema, required: true },
    secondTerm: { type: TermSchema, required: true },
});

export interface MongoQuiz extends Quiz, mongoose.Document { }
const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    items: { type: [TermTupleSchema], required: true },
    state: {
        type: String,
        enum: ["COMPLETED", "FAILED", "NEW"], // TODO make this more type-safe
        default: "NEW"
    },
});

export default mongoose.models.Quiz || mongoose.model<MongoQuiz>("Quiz", QuizSchema);