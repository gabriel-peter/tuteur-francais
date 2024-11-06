import mongoose from "mongoose";
import { Quiz, Term, TermTuple } from "../../types";

export interface MongoTerm extends Term, mongoose.Document { }
const TermSchema = new mongoose.Schema<Term>({
    word: { type: String, required: true },
    language: {
        type: String,
        enum: ["English", "French"],
        required: true
    },
    otherPossibilies: {type: [String], required: false},
    examples: {type: [String], required: false},
});

export interface MongoTermTuple extends TermTuple, mongoose.Document { }
export const TermTupleSchema = new mongoose.Schema<TermTuple>({
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