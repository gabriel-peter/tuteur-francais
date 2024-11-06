import mongoose from "mongoose";
import { TermTupleSchema } from "./quiz/quiz";
import { TermTuple } from "../types";

export interface AnnotatedExcerpt {
    title: string
    content: string
    createdAt: Date
    terms: TermTuple[]
}

export interface MongoAnnotatedExcerpt extends AnnotatedExcerpt, mongoose.Document { }
const AnnotatedExcerptSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true},
    terms: { type: [TermTupleSchema], required: true },
    createdAt: { type: Date, required: true }
});

export default mongoose.models.AnnotatedExcerpt || mongoose.model<AnnotatedExcerpt>("AnnotatedExcerpt", AnnotatedExcerptSchema);