import { TermTuple } from "@/db/types";
import mongoose, { Types } from "mongoose";
import { TermTupleSchema } from "@/db/models/TermTupleSchema";


export interface AnnotatedExcerpt {
    title: string
    content: string
    createdAt: Date
    terms: TermTuple[]
}

export interface MongoAnnotatedExcerpt extends AnnotatedExcerpt, mongoose.Document { 
    _id: string
}
const AnnotatedExcerptSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: false, default: ""},
    terms: { type: [TermTupleSchema], required: true },
    createdAt: { type: Date, required: true }
});

export default mongoose.models?.AnnotatedExcerpt || mongoose.model<AnnotatedExcerpt>("AnnotatedExcerpt", AnnotatedExcerptSchema);